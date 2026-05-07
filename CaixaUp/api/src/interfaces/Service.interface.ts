export interface Service {
  create(data: any): Promise<any>;
  getAll(filter?: any): Promise<any[]>;
  getById(id: string): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}