export interface IProduct {
    id: string;
    name: string;
    sku?: string;
    barcode?: string;
    category?: string;
    description?: string;
    purchasePrice?: number;
    salePrice?: number;
    images?: string[];
}