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
  private currentUserId: string ="";
  user$ = this.userSubject.asObservable();
  

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.loadUser();
  }

  getCurrentUserId(): string {
    const userId = this.currentUserId ?? localStorage.getItem('userId') ?? '';
    console.log('Retrieved userId:', userId);
    return userId;
  }


  async register(email: string, password: string, username: string, phone: string) {
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

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw error;
    }

    await this.supabase.from('usuarios').insert([
      { email, username, phone }
    ]);

    return data;
  }

  async signIn(email: string, password: string): Promise<any> {
    console.log('Signing in user:', { email });

    if (!email || !password) {
      throw new Error('El correo electrónico y la contraseña son obligatorios.');
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Error during sign-in:', error.message);
      throw new Error('Error al iniciar sesión. Verifique su correo electrónico y contraseña.');
    }

    if (data.user) {
      console.log('User signed in:', data.user);
      this.userSubject.next(data.user);
      await this.updateUserDetails(data.user);
      return data.user;
    } else {
      throw new Error('No se pudo autenticar el usuario.');
    }
  }

  private async updateUserDetails(user: any) {
    console.log('Updating user details for:', user.email);

    const { data, error } = await this.supabase
      .from('usuarios')
      .select('username, email, phone, id')
      .eq('email', user.email)
      .single();
  
    if (error) {
      console.error('Error fetching user details:', error.message);
      throw new Error('Error al obtener detalles del usuario.');
    }
  
    console.log('User details retrieved:', data);
    this.userSubject.next({ ...user, ...data });
    this.currentUserId = data.id;
    console.log('Storing userId in localStorage:', this.currentUserId);
    localStorage.setItem('userId', this.currentUserId); // Guardar el ID en localStorage
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw error;
    }
    localStorage.removeItem('userId'); // Eliminar el ID del almacenamiento local
    this.userSubject.next(null);
    this.currentUserId = ""; // Limpiar el ID del usuario
    this.router.navigate(['/login']);
  }

  async loadUser() {
    console.log('Loading user...');

    const storedUserId = localStorage.getItem('userId');
    console.log('Stored userId from localStorage:', storedUserId);
  
    if (storedUserId) {
      const { data: userDetails, error: userError } = await this.supabase
        .from('usuarios')
        .select('username, email, id')
        .eq('id', storedUserId)
        .single();
  
      if (userError) {
        console.error('Error fetching user details:', userError);
        this.userSubject.next(null);
        localStorage.removeItem('userId');
        return;
      }
  
      console.log('User details loaded:', userDetails);
      this.userSubject.next(userDetails);
      this.currentUserId = userDetails.id;
      return;
    }
  
    const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
    console.log('Session data:', session);

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
  
      console.log('User details from session:', userDetails);
      this.userSubject.next({
        ...session.user,
        ...userDetails
      });
      this.currentUserId = userDetails.id;
      console.log('Storing userId in localStorage:', this.currentUserId);
      localStorage.setItem('userId', this.currentUserId);
    } else {
      console.log('No user session found.');
      this.userSubject.next(null);
      this.currentUserId = "";
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
