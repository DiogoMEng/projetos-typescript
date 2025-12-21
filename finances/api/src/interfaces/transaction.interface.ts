export interface Trasaction {
  trasactionId?: string;
  boxBottomId: string;
  categoryId: string;
  movementType: string;
  value: number;
  transactionDate: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}