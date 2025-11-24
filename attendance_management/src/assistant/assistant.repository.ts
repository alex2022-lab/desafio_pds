import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Assistant } from './interfaces/assistant.interface';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import { firstValueFrom, map, catchError, of, throwError } from 'rxjs';
import { AxiosError } from 'axios';

// Función de mapeo para traducir los valores del Enum local (inglés) 
// a los valores del servicio externo (español, minúsculas).
const mapStatusToExternal = (status: string): string => {
    // Normalizamos y reemplazamos espacios/guiones por guiones bajos para flexibilidad
    const normalizedStatus = status.toLowerCase().replace(/ /g, '_'); 

    switch (normalizedStatus) {
        case 'confirmed':
        case 'confirmado':
            return 'confirmado'; // Valor esperado por la dependencia
        case 'not_confirmed':
        case 'no_confirmado':
        default:
            return 'no_confirmado'; // Valor por defecto esperado
    }
};

@Injectable()
export class AssistantRepository {
    private readonly baseUrl: string;
    // ⚠️ CAMBIO CLAVE: Quitamos 'Authorization' de la interfaz
    private readonly requestConfig: { 
        headers: { 'Content-Type': string };
    };

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('DATABASE_SERVICE_URL') || '';
        
        // ⚠️ CAMBIO CLAVE: Inicializamos requestConfig para evitar que sea 'undefined'
        this.requestConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

    private handleError(error: AxiosError) {
        if (error.response) {
            console.error(
                'API Error Response:',
                error.response.status,
                error.response.data,
            );
        } else if (error.request) {
            console.error('API Request Error:', error.request);
        } else {
            console.error('Error during request setup:', error.message);
        }

        return throwError(() => error);
    }

    async create(createAssistantDto: CreateAssistantDto): Promise<Assistant> {
        // ASUMIMOS que this.baseUrl incluye la ruta completa, e.g., http://localhost:3000/attendees
        const url = `${this.baseUrl}`; 
        
        const statusKey = createAssistantDto.status || 'NOT CONFIRMED'; 
        
        const externalDto = {
            ...createAssistantDto,
            status: mapStatusToExternal(statusKey), 
        };

        return firstValueFrom(
            this.httpService
                .post<Assistant>(url, externalDto, this.requestConfig)
                .pipe(
                    map((response) => response.data),
                    catchError((error: AxiosError) => {
                        return this.handleError(error);
                    }),
                ),
        );
    }

    async findAll(): Promise<Assistant[]> {
        const url = `${this.baseUrl}`; 

        return firstValueFrom(
            this.httpService.get<Assistant[]>(url, this.requestConfig).pipe(
                map((response) => response.data),
                catchError((error: AxiosError) => {
                    return this.handleError(error);
                }),
            ),
        );
    }

    async findOne(id: number): Promise<Assistant | null> {
        const url = `${this.baseUrl}/${id}`; 

        return firstValueFrom(
            this.httpService.get<Assistant>(url, this.requestConfig).pipe(
                map((response) => response.data),
                catchError((error: AxiosError) => {
                    if (error.response && error.response.status === 404) {
                        return of(null);
                    }
                    return this.handleError(error);
                }),
            ),
        );
    }

    async update(
        id: number,
        updateAssistantDto: UpdateAssistantDto,
    ): Promise<Assistant | null> {
        const url = `${this.baseUrl}/${id}`; 

        let externalDto: any = updateAssistantDto;
        if (updateAssistantDto.status) {
            externalDto = {
                ...updateAssistantDto,
                status: mapStatusToExternal(updateAssistantDto.status), 
            };
        }

        return firstValueFrom(
            this.httpService
                .patch<Assistant>(url, externalDto, this.requestConfig)
                .pipe(
                    map((response) => response.data),
                    catchError((error: AxiosError) => {
                        if (error.response && error.response.status === 404) {
                            return of(null);
                        }
                        return this.handleError(error);
                    }),
                ),
        );
    }

    async remove(id: number): Promise<void> {
        const url = `${this.baseUrl}/${id}`; 

        await firstValueFrom(
            this.httpService.delete(url, this.requestConfig).pipe(
                map(() => undefined),
                catchError((error: AxiosError) => {
                    if (error.response && error.response.status === 404) {
                        return of(undefined);
                    }
                    return this.handleError(error);
                }),
            ),
        );
    }
}