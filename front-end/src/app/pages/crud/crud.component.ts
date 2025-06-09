import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AreUSureComponent } from '@app/common/components/are-usure/are-usure.component';
import { tematicas } from '@app/core/models/tematicas.model';
import { Cartucho, CartuchoService } from '@app/core/services/cartucho.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSortModule,
    InputNumberModule,
    FloatLabelModule,
    FileUploadModule,
    ToastModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    RouterModule
  ],

  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrudComponent implements OnInit, AfterViewInit {
  nuevoCartuchoForm: FormGroup;

  // Columnas que se muestran en la tabla (ANGULAR MATERIAL)
  displayedColumns: string[] = ['imagenUrl', 'nombre', 'descripcion', 'tematica', 'precio', 'botones'];

  // Fuente de datos para la tabla de cartuchos (ANGULAR MATERIAL)
  dataSource = new MatTableDataSource<Cartucho>([]);

  // Referencia al paginador (ANGULAR MATERIAL)
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Referencia al input de búsqueda
  @ViewChild('searchInput') searchInput!: ElementRef;

  // Variables para paginación
  table: string = 'data';
  totalItems: number = 0;
  totalPages: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;
  searchTerm: string = '';
  sortField: string = 'createdAt';
  sortOrder: string = 'desc';

  tematicas: tematicas[] = [];
  imagenUrl: string | null = null;

  // Variables para editar un cartucho
  editando = false;
  cartuchoEditandoId: string = '';

  nombreArchivo: string = '';

  constructor(
    private messageService: MessageService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cartuchoService: CartuchoService
  ) {
    this.nuevoCartuchoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      tematica: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      imagenUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerCartuchosPaginados();
    this.obtenerTematicas();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    // Buscador de cartuchos con debounce para no sobrecargar el servidor
    fromEvent<KeyboardEvent>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        this.applyFilter(value);
      });
  }

  /**
   * Alterna entre 'asc' y 'desc' en el campo de orden cada vez que el usuario cambia el orden
   * de la tabla. Esta función también actualiza la consulta a la API con el nuevo campo de orden
   * y la dirección de orden.
   */
  inSortChange() {
    const activeSort = this.sort.active; // Obtener el campo de ordenación activo
    const direction = this.sort.direction; // Obtener la dirección del orden (asc o desc)

    if (this.sortField === activeSort) {
      if (direction === 'asc') {
        this.sortOrder = 'desc';
      } else if (direction === 'desc') {
        this.sortOrder = 'asc';
      }
    } else {
      this.sortField = activeSort;
      if (direction === 'asc') {
        this.sortOrder = 'asc';
      } else if (direction === 'desc') {
        this.sortOrder = 'desc';
      }
    }
    this.obtenerCartuchosPaginados();
  }

  /**
   * Obtiene la lista de temáticas desde la API mediante el servicio CartuchoService
   * y las almacena localmente en el componente para su uso en el desplegable del formulario.
   */
  obtenerTematicas(): void {
    this.cartuchoService.getTematicas().subscribe({
      next: (response) => {
        //console.log('Temáticas obtenidas:', response);
        this.tematicas = response;
      },
      error: (err) => {
        console.error('Error al obtener temáticas', err);
      }
    });
  }

  /**
   * Obtiene la lista de cartuchos paginada desde la API
   * y actualiza la fuente de datos del componente.
   */
  obtenerCartuchosPaginados(): void {
    this.cartuchoService
      .obtenerCartuchosPaginados(this.table, this.currentPage, this.pageSize, this.searchTerm, this.sortField, this.sortOrder)
      .subscribe({
        next: (response) => {
          //console.log('Respuesta completa de la API:', response);

          // Actualiza los datos y la información de paginación
          this.dataSource.data = response.entities;
          this.totalItems = response.pagination.total;
          this.totalPages = response.pagination.totalPages;
          this.currentPage = response.pagination.page;
        },
        error: (err) => {
          console.error('Error al obtener cartuchos paginados', err);
        }
      });
  }

  /**
   * Maneja el envío del formulario.
   * Crea un cartucho nuevo o actualiza uno existente según el estado.
   */
  onSubmit() {
    if (this.nuevoCartuchoForm.invalid) {
      console.log('Formulario inválido:', this.nuevoCartuchoForm.errors);
      this.nuevoCartuchoForm.markAllAsTouched();
      return;
    }

    const cartuchoData: Cartucho = {
      nombre: this.nuevoCartuchoForm.value.nombre,
      descripcion: this.nuevoCartuchoForm.value.descripcion,
      precio: this.nuevoCartuchoForm.value.precio,
      tematica: this.nuevoCartuchoForm.value.tematica,
      imagenUrl: this.nuevoCartuchoForm.value.imagenUrl
    };

    console.log('Datos del cartucho a guardar:', cartuchoData);

    if (this.editando === true) {
      this.cartuchoService.actualizarCartucho(this.cartuchoEditandoId, cartuchoData).subscribe({
        next: (response) => {
          console.log('Cartucho actualizado:', response);
          this.obtenerCartuchosPaginados();
          this.nuevoCartuchoForm.reset();
          this.editando = false;
          this.cartuchoEditandoId = '';
        },
        error: (err) => {
          console.error('Error al actualizar cartucho', err);
        }
      });
    } else {
      this.cartuchoService.crearCartucho(cartuchoData).subscribe({
        next: (response) => {
          console.log('Cartucho creado:', response);
          this.nuevoCartuchoForm.reset();
          this.obtenerCartuchosPaginados();
        },
        error: (err) => {
          console.error('Error al crear cartucho', err);
        }
      });
    }
  }

  /**
   * Carga la imagen seleccionada por el usuario y la convierte en base64 para almacenarla
   * en el formulario reactivo, permitiendo su envío al backend.
   * @param event Evento de cambio del input file
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files[0]) {
      const file = input.files[0];
      this.nombreArchivo = file.name;

      const reader = new FileReader();

      // Al cargar el archivo, obtenemos la URL codificada en base64
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          this.imagenUrl = result;
          this.nuevoCartuchoForm.patchValue({
            imagenUrl: this.imagenUrl
          });
        }
      };
      // Leemos el archivo como base64
      reader.readAsDataURL(file);
    }
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }

  /**
   * Activa el modo edición y carga los datos del cartucho seleccionado.
   * @param element Cartucho que se desea editar
   */
  onEditar(element: Cartucho) {
    this.nuevoCartuchoForm.setValue({
      nombre: element.nombre,
      descripcion: element.descripcion,
      precio: element.precio,
      tematica: element.tematica,
      imagenUrl: element.imagenUrl
    });
    this.editando = true;
    this.cartuchoEditandoId = element.id!;
  }

  /**
   * Elimina el cartucho seleccionado y actualiza la lista después de la eliminación.
   * @param cartucho Cartucho a eliminar
   */
  onEliminar(cartucho: Cartucho): void {
    const dialogRef = this.dialog.open(AreUSureComponent, {
      data: { entityName: cartucho.nombre }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && cartucho.id) {
        this.cartuchoService.eliminarCartucho(cartucho.id).subscribe({
          next: () => {
            this.obtenerCartuchosPaginados();
          },
          error: (err) => {
            console.error('Error al eliminar cartucho', err);
            alert('Error al eliminar el cartucho');
          }
        });
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }

  /**
   * Maneja el evento de cambio de página
   * @param event Evento de paginación
   */
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.obtenerCartuchosPaginados();
  }

  /**
   * Aplica un filtro de búsqueda
   * @param search Término de búsqueda
   */
  applyFilter(search: string): void {
    this.searchTerm = search.trim();
    this.currentPage = 1;
    this.obtenerCartuchosPaginados();
  }

  // Getters
  get nombre() {
    return this.nuevoCartuchoForm.get('nombre');
  }

  get descripcion() {
    return this.nuevoCartuchoForm.get('descripcion');
  }

  get precio() {
    return this.nuevoCartuchoForm.get('precio');
  }
}
