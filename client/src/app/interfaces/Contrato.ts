export interface Contrato {
    id: number;
    lote_id: number;
  
    agricultor_id: number;
    comprador_id: number;
  
    precio_unitario: number | string;
    cantidad: number;
    estado: string;
  
    lote_nombre: string;
    agricultor_nombre: string;
    comprador_nombre: string;
  
    costo_estimado: number | string | null;
  }
  