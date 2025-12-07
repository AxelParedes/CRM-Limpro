import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientsService, Client } from './clients.service';
import { AuthService } from './auth.service';

// Mock del AuthService
const mockAuthService = {
  getToken: jasmine.createSpy('getToken').and.returnValue('mock-token-123')
};

describe('ClientsService', () => {
  let service: ClientsService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  // Datos de prueba
  const mockClients: Client[] = [
    {
      id: 1,
      nombre: 'Ana',
      apellido: 'García',
      empresa: 'Tech Solutions SA',
      industria: 'Tecnología',
      email: 'ana.garcia@techsolutions.com',
      telefono: '+52 55 1234 5678',
      estado: 'activo',
      fechaRegistro: new Date('2023-01-15'),
      ingresos: 125000
    },
    {
      id: 2,
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      empresa: 'Constructora Moderna',
      industria: 'Construcción',
      email: 'carlos@constructora.com',
      telefono: '+52 55 2345 6789',
      estado: 'activo',
      fechaRegistro: new Date('2023-02-20'),
      ingresos: 89000
    }
  ];

  const mockClient: Client = {
    id: 1,
    nombre: 'Ana',
    apellido: 'García',
    empresa: 'Tech Solutions SA',
    industria: 'Tecnología',
    email: 'ana.garcia@techsolutions.com',
    telefono: '+52 55 1234 5678',
    estado: 'activo',
    fechaRegistro: new Date('2023-01-15'),
    ingresos: 125000
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ClientsService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(ClientsService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hayan requests pendientes
    mockAuthService.getToken.calls.reset(); // Resetear el spy
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getClients', () => {
    it('should return clients without filters', () => {
      const mockResponse = {
        clients: mockClients,
        total: 2,
        page: 1,
        totalPages: 1
      };

      // Llamar el método
      service.getClients().subscribe(response => {
        expect(response.clients.length).toBe(2);
        expect(response.total).toBe(2);
        expect(response.clients[0].nombre).toBe('Ana');
        expect(response.clients[1].empresa).toBe('Constructora Moderna');
      });

      // Esperar la request y responder con mock
      const req = httpMock.expectOne('http://localhost:3000/api/clients');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token-123');
      
      req.flush(mockResponse);
    });

    it('should return clients with filters', () => {
      const filters = {
        search: 'Tech',
        status: 'activo',
        page: '1',
        limit: '10'
      };

      const mockResponse = {
        clients: [mockClients[0]],
        total: 1,
        page: 1,
        totalPages: 1
      };

      service.getClients(filters).subscribe(response => {
        expect(response.clients.length).toBe(1);
        expect(response.clients[0].empresa).toBe('Tech Solutions SA');
      });

      const req = httpMock.expectOne(
        req => req.url === 'http://localhost:3000/api/clients' &&
               req.params.get('search') === 'Tech' &&
               req.params.get('status') === 'activo'
      );
      
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty response', () => {
      const mockResponse = {
        clients: [],
        total: 0,
        page: 1,
        totalPages: 0
      };

      service.getClients().subscribe(response => {
        expect(response.clients.length).toBe(0);
        expect(response.total).toBe(0);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/clients');
      req.flush(mockResponse);
    });

    it('should handle error', () => {
      const errorMessage = 'Error del servidor';

      service.getClients().subscribe({
        next: () => fail('should have failed with the error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        }
      });

      const req = httpMock.expectOne('http://localhost:3000/api/clients');
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getClient', () => {
    it('should return a single client by id', () => {
      const clientId = 1;

      service.getClient(clientId).subscribe(client => {
        expect(client.id).toBe(1);
        expect(client.nombre).toBe('Ana');
        expect(client.email).toBe('ana.garcia@techsolutions.com');
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/clients/${clientId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token-123');
      
      req.flush(mockClient);
    });

    it('should handle client not found', () => {
      const clientId = 999;

      service.getClient(clientId).subscribe({
        next: () => fail('should have failed with 404'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/clients/${clientId}`);
      req.flush('Client not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createClient', () => {
    it('should create a new client', () => {
      const newClient: Omit<Client, 'id'> = {
        nombre: 'Nuevo',
        apellido: 'Cliente',
        empresa: 'Empresa Nueva',
        industria: 'Consultoría',
        email: 'nuevo@empresa.com',
        telefono: '+52 55 9999 9999',
        estado: 'prospecto',
        fechaRegistro: new Date('2023-06-01'),
        ingresos: 0
      };

      const createdClient: Client = {
        ...newClient,
        id: 3
      };

      service.createClient(newClient).subscribe(client => {
        expect(client.id).toBe(3);
        expect(client.nombre).toBe('Nuevo');
        expect(client.empresa).toBe('Empresa Nueva');
      });

      const req = httpMock.expectOne('http://localhost:3000/api/clients');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newClient);
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token-123');
      
      req.flush(createdClient);
    });
  });

  describe('updateClient', () => {
    it('should update an existing client', () => {
      const clientId = 1;
      const updateData: Partial<Client> = {
        empresa: 'Tech Solutions Actualizada',
        ingresos: 150000
      };

      const updatedClient: Client = {
        ...mockClient,
        ...updateData
      };

      service.updateClient(clientId, updateData).subscribe(client => {
        expect(client.empresa).toBe('Tech Solutions Actualizada');
        expect(client.ingresos).toBe(150000);
        expect(client.id).toBe(1);
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/clients/${clientId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      
      req.flush(updatedClient);
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', () => {
      const clientId = 1;

      service.deleteClient(clientId).subscribe(response => {
        expect(response).toBeUndefined(); // delete normalmente no retorna contenido
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/clients/${clientId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token-123');
      
      req.flush(null); // DELETE normalmente retorna null o vacío
    });

    it('should handle delete error', () => {
      const clientId = 999;

      service.deleteClient(clientId).subscribe({
        next: () => fail('should have failed with 404'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/clients/${clientId}`);
      req.flush('Client not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Auth token handling', () => {
    it('should call authService.getToken for each request', () => {
      service.getClients().subscribe();

      const req = httpMock.expectOne('http://localhost:3000/api/clients');
      expect(authService.getToken).toHaveBeenCalled();
      
      req.flush({ clients: [], total: 0, page: 1, totalPages: 0 });
    });

    it('should handle missing token', () => {
      mockAuthService.getToken.and.returnValue(null);

      service.getClients().subscribe(response => {
        expect(response.clients).toEqual([]);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/clients');
      // Aún sin token, la request se envía (el interceptor manejaría esto)
      req.flush({ clients: [], total: 0, page: 1, totalPages: 0 });
    });
  });
});