import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

export interface ParticipanteFecha {
  participante_id: number;
  fecha_tentativa_id: number;
  opcion_nula: boolean;
}
export interface Participante {
  id: number;
  nombre: string;
  correo?: string;
  telefono: string;
  usuario_id?: string;
  reunion_id: number;
  confirmado?: boolean; // Indica si el participante ha seleccionado fechas tentativas
  fechasSeleccionadas?: FechaReunion[]; // Fechas tentativas seleccionadas por el participante
}

export interface FechaReunion {
  id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

export interface Reunion {
  id: number;
  motivo: string;
  comentarios: string;
  estado: string;
  ubicacion?: string;
  tipo?: string;
  codigo_invitacion: string | null;
  created_by: string;
  fechas_reunion: FechaReunion[];
  participantes: Participante[];
}

interface SupabaseReunion {
  id: number;
  motivo: string;
  comentarios: string;
  estado: string;
  ubicacion: string;
  tipo: string;
  codigo_invitacion: string | null;
  created_by: string;
  fechas_tentativas: {
    id: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
  }[];
  participantes: {
    id: number;
    nombre: string;
    telefono: string;
    usuario_id: string;
    reunion_id: number;
  }[];
}
interface FormattedFechaReunion {
  id: number; // ID de la fecha tentativa
  startDate: Date;
  endDate: Date;
  selected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReunionesService {
  private supabase: SupabaseClient;

  constructor(private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async obtenerParticipantePorIDReunionYIdUsuario(reunionID: number, usuarioID: string) {
    try {
      // Obtener todas las fechas tentativas para la reunión especificada
      const { data: fechasReunion, error: fechasError } = await this.supabase
        .from('fechas_tentativas')
        .select('id')
        .eq('reunion_id', reunionID);
  
      if (fechasError) {
        console.error('Error al obtener las fechas de la reunión:', fechasError);
        throw fechasError;
      }
      console.log(fechasReunion);
      // Si no hay fechas, retornamos un arreglo vacío
      if (!fechasReunion || fechasReunion.length === 0) {
        return null;
      }
  
      // Obtener los participantes que han votado por cada fecha de la reunión
      const participantes: any[] = [];
  
      for (const fecha of fechasReunion) {
        const participantesQueVotaron = await this.obtenerParticipantesQueVotaron(fecha.id);
        // Filtrar el participante por el ID de usuario
        const participante = participantesQueVotaron.find(p => p.usuario_id === usuarioID);
        if (participante) {
          return participante;
        }
      }
  
      // Si no encontramos el participante, retornamos null
      return null;
    } catch (error) {
      console.error('Error en obtenerParticipantePorIDReunionYIdUsuario:', error);
      return null;
    }
  }

  async obtenerParticipantePorIDReunionYIdUsuario2(reunionID: number, usuarioID: string) {
    try {
      // Obtener el participante por ID de reunión y ID de usuario
      const { data: participante, error } = await this.supabase
        .from('participantes')
        .select('*')
        .eq('reunion_id', reunionID)
        .eq('usuario_id', usuarioID)
        .single();
  
      if (error) {
        console.error('Error al obtener el participante:', error);
        throw error;
      }
  
      return participante;
    } catch (error) {
      console.error('Error en obtenerParticipantePorIDReunionYIdUsuario:', error);
      return null;
    }
  }

  async obtenerParticipantesQueVotaron(fechaId: number): Promise<any[]> {
    try {
      // Consulta para obtener los IDs de los participantes que votaron por la fecha especificada
      const { data: participantesFechas, error: fechasError } = await this.supabase
        .from('participante_fechas')
        .select('participante_id')
        .eq('fecha_tentativa_id', fechaId);
  
      if (fechasError) {
        console.error('Error al obtener los IDs de los participantes:', fechasError);
        throw fechasError;
      }
  
      // Si no hay IDs de participantes, retornamos un arreglo vacío
      if (!participantesFechas || participantesFechas.length === 0) {
        return [];
      }
  
      // Extraer los IDs de los participantes
      const participanteIDs = participantesFechas.map(pf => pf.participante_id);
  
      // Consulta para obtener los detalles de los participantes
      const { data: participantes, error: participantesError } = await this.supabase
        .from('participantes')
        .select('*')
        .in('id', participanteIDs);
  
      if (participantesError) {
        console.error('Error al obtener los detalles de los participantes:', participantesError);
        throw participantesError;
      }
  
      return participantes;
    } catch (error) {
      console.error('Error en obtenerParticipantesQueVotaron:', error);
      return [];
    }
  }
  

  async actualizarParticipacion(participanteId: number, fechasSeleccionadas: FechaReunion[]): Promise<any> {
    // Lista para almacenar las inserciones
    const inserts = fechasSeleccionadas.length > 0
      ? fechasSeleccionadas.map(fecha => ({
          participante_id: participanteId,
          fecha_tentativa_id: fecha.id,
          opcion_nula: false
        }))
      : [{
          participante_id: participanteId,
          fecha_tentativa_id: null, // o cualquier valor nulo que la base de datos permita
          opcion_nula: true
        }];
  
    // Realizar la inserción en la base de datos
    const { data, error } = await this.supabase
      .from('participante_fechas')
      .upsert(inserts); // Usar upsert para insertar o actualizar si ya existe
  
    if (error) {
      console.error('Error inserting or updating:', error);
      throw error;
    }
  
    return data;
  }

  

  async obtenerFechasTentativasPorIdReunion(reunionId: number): Promise<FechaReunion[]> {
    // Consultar la tabla 'fechas_tentativas' para obtener las fechas relacionadas con la reunión
    const { data, error } = await this.supabase
      .from('fechas_tentativas')
      .select('id, fecha, hora_inicio, hora_fin')
      .eq('reunion_id', reunionId);
  
    // Manejo de errores de la consulta
    if (error) {
      console.error('Error al obtener fechas tentativas por ID de reunión:', error);
      return [];
    }
  
    // Devolver los datos obtenidos sin transformarlos
    return data;
  }
  

  async obtenerReuniones(): Promise<Reunion[]> {
    const { data: supabaseData, error } = await this.supabase
      .from('reuniones')
      .select(`
        id,
        motivo,
        comentarios,
        estado,
        ubicacion,
        tipo,
        codigo_invitacion,
        created_by,
        fechas_tentativas: fechas_tentativas (
          id,
          fecha,
          hora_inicio,
          hora_fin
        ),
        participantes: participantes (
          id,
          nombre,
          telefono,
          usuario_id,
          reunion_id
        )
      `);
  
    // Log de los datos crudos obtenidos de Supabase
    console.log('Datos obtenidos de Supabase:', supabaseData);
  
    if (error) {
      console.error('Error fetching reuniones:', error);
      return [];
    }
  
    // Transformar los datos
    const reuniones: Reunion[] = supabaseData.map((data: any) => ({
      id: data.id,
      motivo: data.motivo,
      comentarios: data.comentarios,
      estado: data.estado,
      ubicacion: data.ubicacion,
      tipo: data.tipo,
      codigo_invitacion: data.codigo_invitacion === null ? undefined : data.codigo_invitacion, // Transformar null a undefined
      created_by: data.created_by,
      fechas_reunion: data.fechas_tentativas,
      participantes: data.participantes
    }));
  
    // Log de los datos transformados
    console.log('Datos transformados:', reuniones);
  
    return reuniones;
  }
  
  async actualizarReunion(reunion: Reunion): Promise<any> {
    const { data, error } = await this.supabase
      .from('reuniones')
      .update({
        participantes: reunion.participantes // Asumiendo que 'participantes' es un campo que puede ser actualizado en la base de datos
      })
      .eq('id', reunion.id); // Asegúrate de que 'id' sea el campo correcto

    if (error) {
      console.error('Error actualizando reunión:', error);
      throw error;
    }

    return data;
  }

  async obtenerReunionPorId(id: number): Promise<Reunion | null> {
    const { data, error } = await this.supabase
      .from('reuniones')
      .select(`
        id,
        motivo,
        comentarios,
        estado,
        ubicacion,
        tipo,
        codigo_invitacion,
        created_by,
        fechas_tentativas: fechas_tentativas(
          id,
          fecha,
          hora_inicio,
          hora_fin
        ),
        participantes: participantes(
          id,
          nombre,
          telefono,
          usuario_id,
          reunion_id,
          participante_fechas: participante_fechas(
            participante_id,
            fecha_tentativa_id,
            opcion_nula
          )
        )
      `)
      .eq('id', id)
      .single();
  
    if (error) {
      console.error('Error fetching reunion by ID:', error);
      return null;
    }
  
    const participantesConFechas: Participante[] = data.participantes.map((participante: any) => {
      const fechasSeleccionadas = participante.participante_fechas?.map((pf: any) => ({
        id: pf.fecha_tentativa_id,
        fecha: data.fechas_tentativas.find((f: any) => f.id === pf.fecha_tentativa_id)?.fecha,
        hora_inicio: data.fechas_tentativas.find((f: any) => f.id === pf.fecha_tentativa_id)?.hora_inicio,
        hora_fin: data.fechas_tentativas.find((f: any) => f.id === pf.fecha_tentativa_id)?.hora_fin,
      })) || [];
  
      return {
        ...participante,
        fechasSeleccionadas
      };
    });
  
    return {
      id: data.id,
      motivo: data.motivo,
      comentarios: data.comentarios,
      estado: data.estado,
      ubicacion: data.ubicacion,
      tipo: data.tipo,
      codigo_invitacion: data.codigo_invitacion === null ? undefined : data.codigo_invitacion,
      created_by: data.created_by,
      fechas_reunion: data.fechas_tentativas,
      participantes: participantesConFechas
    };
  }
  
  
  
  

  async checkInvitationCodeExists(codigo: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('reuniones')
      .select('id')
      .eq('codigo_invitacion', codigo)
      .single();

    if (error) {
      console.error('Error checking invitation code:', error);
      throw error;
    }

    return !!data;
  }

  async updateReunionCode(reunionId: number, code: string): Promise<void> {
    const { error } = await this.supabase
      .from('reuniones')
      .update({ codigo_invitacion: code })
      .eq('id', reunionId);

    if (error) {
      throw new Error(`Error updating invitation code: ${error.message}`);
    }
  }

  async isInvitationCodeUnique(code: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('reuniones')
      .select('id')
      .eq('codigo_invitacion', code);

    if (error) {
      throw new Error(`Error checking invitation code uniqueness: ${error.message}`);
    }

    return data.length === 0;
  }

  async crearReunion(reunion: Reunion): Promise<void> {
    const { motivo, ubicacion, tipo, codigo_invitacion, comentarios, estado, fechas_reunion, created_by } = reunion;
  
    if (!created_by) {
      console.error('User ID is invalid or not found:', created_by);
      throw new Error('User ID is invalid or not found');
    }
  
    try {
      // Obtener detalles del usuario
      const userDetails = await this.authService.getUserDetails();
      if (!userDetails) {
        throw new Error('User details not found');
      }
  
      // Insertar la reunión en la tabla 'reuniones'
      const { data: insertedReunion, error: reunionError } = await this.supabase
        .from('reuniones')
        .insert([
          {
            motivo,
            ubicacion,
            tipo,
            codigo_invitacion,
            comentarios,
            estado,
            created_by
          }
        ])
        .select()
        .single();
  
      if (reunionError) {
        throw reunionError;
      }
  
      const reunionId = insertedReunion.id;
  
      // Insertar las fechas asociadas a la reunión en la tabla 'fechas_tentativas'
      const { error: fechasError } = await this.supabase
        .from('fechas_tentativas')
        .insert(
          fechas_reunion.map(fecha => ({
            reunion_id: reunionId,
            fecha: fecha.fecha,
            hora_inicio: fecha.hora_inicio,
            hora_fin: fecha.hora_fin
          }))
        );
  
      if (fechasError) {
        await this.supabase.from('reuniones').delete().eq('id', reunionId);
        throw fechasError;
      }
  
      // Crear el objeto Participante
      const participante: Participante = {
        id: 0, // El ID se puede generar automáticamente
        nombre: userDetails.username,
        telefono: userDetails.phone,
        usuario_id: created_by, // Asume que created_by es el ID del usuario
        reunion_id: reunionId
      };
  
      // Insertar al participante
      await this.agregarParticipante(participante);
  
      console.log('Nueva reunión creada (desde service):', reunion);
    } catch (error) {
      console.error('Error al crear la reunión:', error);
      throw error;
    }
  }
  
  async agregarParticipante(participante: Participante): Promise<void> {
    const { nombre, telefono, usuario_id, reunion_id } = participante;
  
    try {
      const { error: participantError } = await this.supabase
        .from('participantes')
        .insert([{
          nombre,
          telefono,
          usuario_id,
          reunion_id
        }]);
  
      if (participantError) {
        // Rollback de la reunión y fechas si la inserción del participante falla
        await this.supabase
          .from('reuniones')
          .delete()
          .eq('id', reunion_id);
  
        await this.supabase
          .from('fechas_tentativas')
          .delete()
          .eq('reunion_id', reunion_id);
  
        throw new Error(`Error al agregar el participante: ${participantError.message}`);
      }
  
      console.log('Participante agregado con éxito');
    } catch (error) {
      console.error('Error al agregar participante:', error);
      throw error;
    }
  }
  
  

  async actualizarEstadoReunion(reunionId: number, nuevoEstado: string): Promise<void> {
    const { error } = await this.supabase
      .from('reuniones')
      .update({ estado: nuevoEstado })
      .eq('id', reunionId);

    if (error) {
      throw new Error(`Error al actualizar el estado de la reunión: ${error.message}`);
    }
  }
  async obtenerReunionesPorParticipante(usuarioId: string): Promise<Reunion[]> {
    // Primero, obtener los IDs de las reuniones donde el usuario es participante
    const { data: participantesData, error: participantesError } = await this.supabase
      .from('participantes')
      .select('reunion_id')
      .eq('usuario_id', usuarioId);
    
    if (participantesError) {
      console.error('Error fetching participante reuniones:', participantesError);
      return [];
    }

    const reunionIds = participantesData.map((p: { reunion_id: number }) => p.reunion_id);

    // Luego, obtener las reuniones usando los IDs obtenidos
    const { data: reunionesData, error: reunionesError } = await this.supabase
      .from('reuniones')
      .select(`
        id,
        motivo,
        comentarios,
        estado,
        ubicacion,
        tipo,
        codigo_invitacion,
        created_by,
        fechas_tentativas (
          id,
          fecha,
          hora_inicio,
          hora_fin
        ),
        participantes (
          id,
          nombre,
          telefono,
          usuario_id,
          reunion_id
        )
      `)
      .in('id', reunionIds);
    
    if (reunionesError) {
      console.error('Error fetching reuniones for participante:', reunionesError);
      return [];
    }

    // Transformar los datos
    const reuniones: Reunion[] = reunionesData.map((data: any) => ({
      id: data.id,
      motivo: data.motivo,
      comentarios: data.comentarios,
      estado: data.estado,
      ubicacion: data.ubicacion,
      tipo: data.tipo,
      codigo_invitacion: data.codigo_invitacion === null ? undefined : data.codigo_invitacion, // Transformar null a undefined
      created_by: data.created_by,
      fechas_reunion: data.fechas_tentativas,
      participantes: data.participantes
    }));

    return reuniones;
  }

  
  async obtenerReunionesPorCreador(usuarioId: string): Promise<Reunion[]> {
    const { data: supabaseData, error } = await this.supabase
      .from('reuniones')
      .select(`
        id,
        motivo,
        comentarios,
        estado,
        ubicacion,
        tipo,
        codigo_invitacion,
        created_by,
        fechas_tentativas: fechas_tentativas (
          id,
          fecha,
          hora_inicio,
          hora_fin
        ),
        participantes: participantes (
          id,
          nombre,
          telefono,
          usuario_id,
          reunion_id
        )
      `)
      .eq('created_by', usuarioId);
  
    if (error) {
      console.error('Error fetching reuniones for creador:', error);
      return [];
    }
  
    // Transformar los datos para que coincidan con la interfaz Reunion
    const reuniones: Reunion[] = supabaseData.map((data: any) => ({
      id: data.id,
      motivo: data.motivo,
      comentarios: data.comentarios,
      estado: data.estado,
      ubicacion: data.ubicacion,
      tipo: data.tipo,
      codigo_invitacion: data.codigo_invitacion === null ? undefined : data.codigo_invitacion, // Transformar null a undefined
      created_by: data.created_by,
      fechas_reunion: data.fechas_tentativas,
      participantes: data.participantes
    }));
  
    return reuniones;
  }
  
  async eliminarReunion(reunionId: number): Promise<void> {
    try {
      // Eliminar fechas asociadas
      const { error: fechasError } = await this.supabase
        .from('fechas_tentativas')
        .delete()
        .eq('reunion_id', reunionId);
  
      if (fechasError) {
        throw fechasError;
      }
  
      // Eliminar participantes asociados
      const { error: participantesError } = await this.supabase
        .from('participantes')
        .delete()
        .eq('reunion_id', reunionId);
  
      if (participantesError) {
        throw participantesError;
      }
  
      // Eliminar reunión
      const { error: reunionError } = await this.supabase
        .from('reuniones')
        .delete()
        .eq('id', reunionId);
  
      if (reunionError) {
        throw reunionError;
      }
  
      console.log('Reunión eliminada con éxito');
    } catch (error) {
      console.error('Error al eliminar la reunión:', error);
      throw error;
    }
  }  
}
