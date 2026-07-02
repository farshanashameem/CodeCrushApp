import IconEntity from '@/Domain/Entities/Icon.entity';

export interface CreateIconInputDTO {
    name: string;
    iconKey: string;
    color: string;
    category?: string;
    
}

export interface CreateIconOutputDTO {
    icon: IconEntity
}