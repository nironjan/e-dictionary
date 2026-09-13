export interface Language {
  id: string;
  code: string;
  name: string;
  slug: string;
  nativeName?: string | null;
  isActive: boolean;
  isRtl: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLanguageDto {
  code: string;
  name: string;
  nativeName?: string;
  isActive?: boolean;
  isRtl?: boolean;
  sortOrder?: number;
}

export interface UpdateLanguageDto extends Partial<CreateLanguageDto> {
  id?: string;
}
