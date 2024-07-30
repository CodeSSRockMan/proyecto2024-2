import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<any>(null);
  private currentUserId: string | null = null;
  user$ = this.userSubject.asObservable();

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.loadUser();
  }

  getCurrentUserId(): string {
    return this.currentUserId || ''; // Proporciona un valor predeterminado si `currentUserId` es `null`
  }

  async register(email: string, password: string, username: string, phone: string) {
    // Verificar si el correo electrónico o el teléfono ya están registrados
    const { data: existingUser, error: fetchError } = await this.supabase
      .from('usuarios')
      .select('*')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (existingUser) {
      throw new Error('El correo electrónico o el número de teléfono ya están registrados.');
    }

    // Registrar el nuevo usuario
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw error;
    }

    // Guardar información adicional en la base de datos
    await this.supabase.from('usuarios').insert([
      { email, username, phone }
    ]);

    return data;
  }

  async signIn(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new Error('El correo electrónico y la contraseña son obligatorios.');
    }
  
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      console.error('Error durante el inicio de sesión:', error.message);
      throw new Error('Error al iniciar sesión. Verifique su correo electrónico y contraseña.');
    }
  
    if (data.user) {
      this.userSubject.next(data.user);
  
      // Actualiza los detalles del usuario y el ID
      await this.updateUserDetails(data.user);
  
      console.log('Usuario autenticado:', data.user);
      return data.user;
    } else {
      throw new Error('No se pudo autenticar el usuario.');
    }
  }
  
  private async updateUserDetails(user: any) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('username, email, phone, id') // Asegúrate de incluir el campo 'id'
      .eq('email', user.email)
      .single();
  
    if (error) {
      console.error('Error al obtener detalles del usuario:', error.message);
      throw new Error('Error al obtener detalles del usuario.');
    }
  
    // Actualiza el estado del usuario y el ID
    this.userSubject.next({ ...user, ...data });
    this.currentUserId = data.id; // Guarda el ID del usuario
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut(); // Cierra sesión en Supabase
    if (error) {
      throw error;
    }
    localStorage.removeItem('auth-token'); // Elimina el token de autenticación del almacenamiento local
    this.userSubject.next(null); // Limpiar el estado del usuario
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

  async loadUser() {
    const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
  
    if (sessionError) {
      console.error('Error fetching session:', sessionError);
      this.userSubject.next(null);
      return;
    }
  
    if (session?.user) {
      const { data: userDetails, error: userError } = await this.supabase
        .from('usuarios')
        .select('username, email, id')
        .eq('email', session.user.email)
        .single();
  
      if (userError) {
        console.error('Error fetching user details:', userError);
        this.userSubject.next(null);
        return;
      }
  
      // Actualiza el estado del usuario con los detalles completos
      this.userSubject.next({
        ...session.user,
        ...userDetails
      });
      this.currentUserId = userDetails.id; // Guarda el ID del usuario
    } else {
      this.userSubject.next(null);
      this.currentUserId = null; // Limpia el ID del usuario si no hay sesión
    }
  }

  async buscarUsuarioPorCorreoOTelefono(correo: string, telefono: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('id, username, phone, email')
      .or(`email.eq.${correo},phone.eq.${telefono}`)
      .single();
    
    if (error) {
      console.error('Error buscando usuario:', error);
      throw error;
    }
    
    return data;
  }
  

  async getUserDetails() {
    const user = this.userSubject.value;
    if (user) {
      const { data, error } = await this.supabase
        .from('usuarios')
        .select('username,phone, email')
        .eq('email', user.email)
        .single();
      if (error) {
        console.error('Error fetching user details:', error);
        throw error;
      }
      console.log('Fetched user details:', data); // Log para depuración
      return data;
    }
    return null;
  }
}
