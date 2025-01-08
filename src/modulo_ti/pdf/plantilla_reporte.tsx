import React, { useEffect, useState } from 'react';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { X } from 'lucide-react';
import { FiLoader } from 'react-icons/fi';
import BotonRegresar from '../Regresar';
import { ObtenerControlById } from '@/api_conexion/servicios/controlEquipo';
import Loading from '../Loading';
import marcaAgua from '@/assets/marca-de-agua.png'
import { useParams } from 'react-router-dom';
import logoReporte from '@/assets/occidente-pdf.jpeg'

const HistorialporID: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const NumericId = id ? parseInt(id, 10) : undefined;
    const [isLoading, setIsLoading] = useState(false);
    const [{ data: controlData, loading: loadingControl }] = ObtenerControlById(NumericId);

    const [formData, setFormData] = useState({
        fecha: '',
        fecha1: '',
        fecha2: '',
        tecnico: '',
        agencia: '',
        infraestructura: false,
        ticketAyuda: '',
        id1: '',
        id2: '',
        equipoReparacion: false,
        equipoPrestado: false,
        otrosEspecificar: '',
        cambioEquipo: false,
        devolucionEquipo: false,
        entregaEquipo: false,
        equipoReparado: false,
        soporte: false,
        equipos: Array(8).fill({
            descripcionEquipo: '',
            inventario: '',
            modeloTipo: '',
            serie: '',
            pertenece: '',
            destino: '',
        }),
        observaciones: '',
        recibe: '',
        entrega: '',
    });

    useEffect(() => {
        if (controlData) {
            // Actualizar formData con los datos obtenidos
            setFormData({
                fecha: controlData.fecha || '',
                tecnico: controlData.tecnico || '',
                agencia: controlData.agencia || '',
                infraestructura: controlData.infraestructura === 1, // Asumiendo que el valor 1 es true
                ticketAyuda: controlData.ticket_ayuda || '',
                equipoReparacion: controlData.equipo_reparacion === 1,
                equipoPrestado: controlData.equipo_prestado === 1,
                otrosEspecificar: controlData.otros_especificar || '',
                cambioEquipo: controlData.cambio_equipo === 1,
                devolucionEquipo: controlData.devolucion_equipo === 1,
                entregaEquipo: controlData.entrega_equipo === 1,
                equipoReparado: controlData.equipo_reparado === 1,
                soporte: controlData.soporte === 1,
                observaciones: controlData.observaciones || '',

                // Aquí mapeamos los equipos y completamos los vacíos si es necesario
                equipos: [
                    ...controlData.equipos.map((equipo) => ({
                        descripcionEquipo: equipo.descripcion_equipo || '',
                        inventario: equipo.inventario || '',
                        modeloTipo: equipo.modelo_tipo || '',
                        serie: equipo.serie || '',
                        pertenece: equipo.pertenece || '',
                        destino: equipo.destino || '',
                    })),
                    ...Array(8 - controlData.equipos.length).fill({
                        descripcionEquipo: '',
                        inventario: '',
                        modeloTipo: '',
                        serie: '',
                        pertenece: '',
                        destino: '',
                    }),
                ],

                // Los campos 'fecha1' y 'fecha2' no están presentes en la respuesta de la API, por lo que quedarán vacíos.
                fecha1: '',
                fecha2: '',
                id1: '',
                id2: '',
                recibe: '',
                entrega: '',
            });
        }
    }, [controlData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
        const { name, value, type } = e.target;
        setFormData(prev => {
            if (index !== undefined && name in prev.equipos[0]) {
                const newEquipos = [...prev.equipos];
                newEquipos[index] = { ...newEquipos[index], [name]: value };
                return { ...prev, equipos: newEquipos };
            }
            return {
                ...prev,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
            };
        });
    };
    const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : e.target.value,
        }));
    };

    if (loadingControl) return <Loading />;
    if (!controlData) return <div>Error al obtener los datos</div>;

    const captureAndShowPreview = () => {
        setIsLoading(true); // Establecer isLoading en true

        const input = document.getElementById('pdf-content');
        if (input) {
            domtoimage.toPng(input, { bgcolor: '#ffffff', quality: 10 })
                .then((dataUrl) => {
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'px',
                        format: 'letter', // Tamaño carta
                    });
                    const imgProps = pdf.getImageProperties(dataUrl);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                    pdf.addImage(dataUrl, 'PNG', 0, 5, pdfWidth, pdfHeight);

                    // Guardar el PDF como un Blob y abrirlo en una nueva pestaña
                    const blob = pdf.output('blob');
                    const url = URL.createObjectURL(blob);
                    window.open(url); // Abre el PDF en una nueva pestaña

                    // Establecer isLoading en false después de completar el proceso
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Oops, something went wrong!', error);
                    setIsLoading(false); // Asegurarse de establecer isLoading en false en caso de error
                });
        } else {
            setIsLoading(false); // Si no se encuentra el elemento, también establecer isLoading en false
        }
    };

    return (
        <>
            <div className='-mt-10'>

                <BotonRegresar />
            </div>

            <div className='mx-5 text-black '>
                <div className="font-sans p-10" id="pdf-content">
                    <div className='flex justify-between items-center mb-3'>
                        <img src={logoReporte} alt="logo" className="font-bold text-lg mb-5 w-44" />
                        <div className="text-center font-semibold text-3xl mr-16 whitespace-nowrap">
                            Control de Entradas y Salidas de Equipos
                        </div>
                        <div className="text-xl  whitespace-nowrap font-semibold">F-TI-518-V2</div>
                    </div>

                    <img
                        src={marcaAgua}
                        alt="Marca de Agua"
                        className="absolute inset-0 opacity-10 "
                        style={{
                            width: '1200px',
                            height: '230vh',
                            top: '137%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none'
                        }}
                    />


                    <div className="flex flex-col items-center ">
                        <label className='text-orange-400 flex items-center'>
                            <label className='mr-2 font-semibold text-2xl whitespace-nowrap'>DATOS GENERALES</label>
                            <div className="w-96 h-3 bg-orange-400 "></div>
                            <div className="w-96 h-3 bg-orange-400"></div>
                            <div className="w-48 h-3 bg-orange-400"></div>
                            {/* <div className="w-7 h-3 bg-orange-400"></div> */}
                        </label>
                    </div>

                    <table className=" border-collapse mb-5 text-xl">
                        <tbody>
                            <tr>
                                <td className="p-1 border border-black w-1/4">Fecha: <input disabled type="text" name="fecha" value={formData.fecha} onChange={handleInputChange} className="w-3/5 border-none font-semibold" /></td>
                                <td colSpan={3} className="p-1 border border-black w-full">Técnico: <input disabled type="text" name="tecnico" value={formData.tecnico} onChange={handleInputChange} className="w-4/5 border-none font-semibold" /></td>
                            </tr>
                            <tr>
                                <td className="p-1 border border-black w-1/4  ">Agencia: <input disabled type="text" name="agencia" value={formData.agencia} onChange={handleInputChange} className="w-[270px] border-none bg-transparent text-sm text-center " /></td>
                                <td colSpan={3} className="p-1 border-r flex border-black w-full gap-24">
                                    {/* Área de Infraestructura y Taller */}
                                    <div className="flex items-center ">
                                        <label className="ml-2  mr-5 whitespace-nowrap">
                                            Área de Infraestructura y Taller:
                                        </label>
                                        <div className="relative w-9 rounded-lg h-6 border-4 bg-white border-black flex items-center justify-center">
                                            <input disabled
                                                type="checkbox"
                                                name="infraestructura"
                                                checked={formData.infraestructura}
                                                onChange={handleInputChange}
                                                className="absolute opacity-0 w-full h-full cursor-pointer "
                                            />
                                            {formData.infraestructura && (
                                                <span className="text-black font-bold"><X /></span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Área de Soporte Técnico */}
                                    <div className="flex items-center ">
                                        <label className="ml-2 mr-5 whitespace-nowrap">
                                            Área de Soporte Técnico:
                                        </label>
                                        <div className="relative w-9 rounded-lg h-6 border-4 bg-white border-black flex items-center justify-center">
                                            <input disabled
                                                type="checkbox"
                                                name="soporte"
                                                checked={formData.soporte}
                                                onChange={handleInputChange}
                                                className="absolute opacity-0 w-full h-full cursor-pointer"
                                            />
                                            {formData.soporte && (
                                                <span className="text-black font-bold"><X /></span>
                                            )}
                                        </div>
                                    </div>
                                </td>


                            </tr>
                            <tr>
                                <td colSpan={4} className="p-1 border border-black">No. de Ticket de Mesa de Ayuda: <input disabled type="text" name="ticketAyuda" value={formData.ticketAyuda} onChange={handleInputChange} className="w-1/2 border-none" /></td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex flex-col items-center mb-2">
                        <label className='text-orange-400 flex items-center'>
                            <span className='mr-2 font-semibold text-2xl whitespace-nowrap'>DETALLE DE LA SOLICITUD</span>
                            <div className="w-96 h-3 bg-orange-400 "></div>
                            <div className="w-96 h-3 bg-orange-400"></div>
                            <div className="w-28 h-3 bg-orange-400"></div>
                            {/* <div className="w-8 h-3 bg-orange-400"></div> */}
                        </label>
                    </div>

                    <table className="w-full border-collapse text-2xl">
                        <tbody>
                            <tr>
                                <td colSpan={6} className="p-1 border text-xl font-semibold border-black bg-orange-300">I. &nbsp; Entradas/Salidas del Equipo:</td>
                            </tr>
                            <tr>
                                <td colSpan={6} className="p-1 border border-black">
                                    <div className="grid grid-cols-3 gap-4 mb-2">
                                        {/* Primera columna */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center mb-3">
                                                <label className="text-xl mr-3">
                                                    Equipo para Reparación
                                                </label>
                                                <div className="relative w-9 rounded-lg h-6 border-4 bg-white ml-4 border-black flex items-center justify-center">
                                                    <input disabled
                                                        type="checkbox"
                                                        name="equipoReparacion"
                                                        checked={formData.equipoReparacion as boolean}
                                                        onChange={handleInputChange2}
                                                        className="absolute opacity-0 w-full h-full cursor-pointer"
                                                    />
                                                    {formData.equipoReparacion && (
                                                        <span className="text-black font-bold"><X /></span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center mb-3">
                                                <label className="text-xl mr-3">
                                                    Cambio de Equipo
                                                </label>
                                                <div className="relative w-9 rounded-lg h-6 border-4 ml-16 bg-white border-black flex items-center justify-center">
                                                    <input disabled
                                                        type="checkbox"
                                                        name="cambioEquipo"
                                                        checked={formData.cambioEquipo as boolean}
                                                        onChange={handleInputChange2}
                                                        className="absolute opacity-0 w-full h-full cursor-pointer"
                                                    />
                                                    {formData.cambioEquipo && (
                                                        <span className="text-black font-bold"><X /></span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center mb-3">
                                                <label className="text-xl mr-3">
                                                    Entrega de Equipo
                                                </label>
                                                <div className="relative w-9 rounded-lg h-6 border-4 ml-16 bg-white border-black flex items-center justify-center">
                                                    <input disabled
                                                        type="checkbox"
                                                        name="entregaEquipo"
                                                        checked={formData.entregaEquipo as boolean}
                                                        onChange={handleInputChange2}
                                                        className="absolute opacity-0 w-full h-full cursor-pointer"
                                                    />
                                                    {formData.entregaEquipo && (
                                                        <span className="text-black font-bold"><X /></span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Segunda columna */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center mb-3">
                                                <label className="text-xl mr-3 whitespace-nowrap">
                                                    Entrega de Equipo Prestado
                                                </label>
                                                <div className="relative w-9 rounded-lg h-6 border-4 ml-16 bg-white border-black flex items-center justify-center">
                                                    <input disabled
                                                        type="checkbox"
                                                        name="equipoPrestado"
                                                        checked={formData.equipoPrestado as boolean}
                                                        onChange={handleInputChange2}
                                                        className="absolute opacity-0 w-full h-full cursor-pointer"
                                                    />
                                                    {formData.equipoPrestado && (
                                                        <span className="text-black font-bold"><X /></span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center mb-3">
                                                <label className="text-xl mr-3">
                                                    Devolución de Equipo Prestado
                                                </label>
                                                <div className="relative w-9 rounded-lg h-6 border-4 ml-8 bg-white border-black flex items-center justify-center">
                                                    <input disabled
                                                        type="checkbox"
                                                        name="devolucionEquipo"
                                                        checked={formData.devolucionEquipo as boolean}
                                                        onChange={handleInputChange2}
                                                        className="absolute opacity-0 w-full h-full cursor-pointer"
                                                    />
                                                    {formData.devolucionEquipo && (
                                                        <span className="text-black font-bold"><X /></span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center mb-3">
                                                <label className="text-xl mr-3">
                                                    Entrega de Equipo Reparado
                                                </label>
                                                <div className="relative w-9 rounded-lg h-6 border-4 ml-14 bg-white border-black flex items-center justify-center">
                                                    <input disabled
                                                        type="checkbox"
                                                        name="equipoReparado"
                                                        checked={formData.equipoReparado as boolean}
                                                        onChange={handleInputChange2}
                                                        className="absolute opacity-0 w-full h-full cursor-pointer"
                                                    />
                                                    {formData.equipoReparado && (
                                                        <span className="text-black font-bold"><X /></span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tercera columna: Otros */}
                                        <div className="flex items-center col-col -mt-20">
                                            <label className="text-xl mr-3 whitespace-nowrap">Otros Especifique:</label>
                                            <input disabled
                                                type="text"
                                                name="otrosEspecificar"
                                                value={formData.otrosEspecificar}
                                                onChange={handleInputChange2}
                                                className="bg-transparent underline w-1/2 text-xl"
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>


                            <tr>
                                <td colSpan={6} className="p-1 border border-black font-semibold text-xl bg-orange-300">II.&nbsp; Detalle del Equipo:</td>
                            </tr>
                            <tr>
                                {['Descripción del Equipo', 'Inventario', 'Modelo/Tipo', 'Serie', 'Pertenece a', 'Destino'].map((header, index) => (
                                    <th key={header} className={`p border text-xl border-black text-center font-bold ${index === 0 ? 'w-1/3' : ''}`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                            {formData.equipos.map((equipo, index) => (
                                <tr key={index}>
                                    {Object.keys(equipo).map((field) => (
                                        <td key={field} className=" border border-black text-center">
                                            <input disabled
                                                type="text"
                                                name={field}
                                                value={equipo[field as keyof typeof equipo]}
                                                onChange={(e) => handleInputChange(e, index)}
                                                className={`border-none text-center  font-medium  ${field === 'descripcionEquipo' ? 'w-10/12  text-xl' : 'w-full  text-base'}`} // Aumentando el ancho solo para la descripción
                                                style={{ height: '35px' }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            <tr>
                                <td colSpan={6} className="p-1 border-l border-r font-bold text-xl border-black">III. Observaciones:</td>
                            </tr>
                            <tr>
                                <td colSpan={6} className="p-1 border-b border-l border-r border-black">
                                    <textarea
                                        name="observaciones"
                                        value={formData.observaciones}
                                        onChange={handleInputChange}
                                        className="w-full h-[100px] border-none resize-none"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table className="w-full border-collapse text-2xl">
                        <tbody className='font-semibold'>
                            <tr >
                                <td colSpan={4} className="p-1 border-l border-r font-bold text-xl border-black ">IV. Aceptación del Servicio, Nombre y Firma</td>
                            </tr>

                            {/* RECIBE */}

                            <tr >
                                <td colSpan={2} className="p-1 border-l border-black w-1/2 ">
                                    <div className='ml-5 mt-5 mr-5'>

                                        <div className="flex mb-2">
                                            <span className="ml-2 text-lg font-bold">Recibe</span>
                                            <div className=" ml-7 border-4 rounded-2xl border-orange-400 w-full h-24 flex items-center">
                                                <input disabled
                                                    type="text"
                                                    name="recibe"
                                                    value={formData.recibe}
                                                    onChange={handleInputChange}
                                                    className="w-full h-3/4 ml-5 px-2 border-none"
                                                />
                                            </div>
                                        </div>

                                        {/* ID y Fecha debajo del input de "Recibe" */}
                                        <div className="flex mt-2 ml-24 ">
                                            <div className="relative flex items-center mb-2 w-7/12">
                                                <span className="mr-2 text-xl">Id:</span>
                                                <input disabled
                                                    type="text"
                                                    name="id1"
                                                    value={formData.id1}
                                                    onChange={handleInputChange}
                                                    className="w-full border-none text-xl"
                                                />
                                                <div className="absolute left-0 bottom-0 w-11/12 ml-6 h-[2px] bg-black"></div>
                                            </div>

                                            <div className="flex items-center w-1/2 ml-2">
                                                <span className="mr-2 text-xl">Fecha:</span>
                                                <input disabled
                                                    type="text"
                                                    name="fecha1"
                                                    value={formData.fecha1}
                                                    onChange={handleInputChange}
                                                    placeholder="_____/______/_____"
                                                    className="w-4/5 border-none underline text-xl"
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td colSpan={2} className="p-1 border-r border-black w-1/2">
                                    <div className='ml-16 mt-5 mr-5'>

                                        <div className="flex  mb-2 mr-5">
                                            <div className=" ml-5 border-4 rounded-2xl border-orange-400 w-full h-24 flex items-center">
                                                <input disabled
                                                    type="text"
                                                    name="recibe"
                                                    className="w-full h-3/4 ml-5 px-2 border-none bg-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex mt-2 ml-6">
                                            <div className="relative flex items-center mb-2 w-7/12">
                                                <span className="mr-2 text-xl">Id:</span>
                                                <input disabled
                                                    type="text"
                                                    name="id55"
                                                    className="w-full border-none text-xl bg-transparent"
                                                />
                                                <div className="absolute left-0 bottom-0 w-11/12 ml-6 h-[2px] bg-black"></div>
                                            </div>

                                            <div className="flex items-center w-1/2 ml-2">
                                                <span className="mr-2 text-xl">Fecha:</span>
                                                <input disabled
                                                    type="text"
                                                    name="fecha1"
                                                    placeholder="_____/______/_____"
                                                    className="w-3/4 border-none underline text-lg"
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* ENTREGA */}

                            <tr >
                                <td colSpan={2} className="p-1 border-l border-black w-1/2 ">
                                    <div className='ml-5 mr-5'>

                                        <div className="flex mb-2  items-center">
                                            <span className="ml-2 text-lg font-bold">Entrega</span>
                                            <div className=" ml-5 border-4 rounded-2xl border-orange-400 w-full h-24 flex items-center">
                                                <input disabled
                                                    type="text"
                                                    name="entrega"
                                                    value={formData.entrega}
                                                    onChange={handleInputChange}
                                                    className="w-full h-3/4 ml-6 px-2 border-none"
                                                />
                                            </div>
                                        </div>

                                        {/* ID y Fecha debajo del input de "Recibe" */}
                                        <div className="flex mt-2 ml-24">
                                            <div className="relative flex items-center mb-2 w-7/12">
                                                <span className="mr-2 text-xl">Id:</span>
                                                <input disabled
                                                    type="text"
                                                    name="id2"
                                                    value={formData.id2}
                                                    onChange={handleInputChange}
                                                    className="w-full border-none text-xl"
                                                />
                                                <div className="absolute left-0 bottom-0 w-11/12 ml-5 h-[2px] bg-black"></div>
                                            </div>

                                            <div className="flex items-center w-1/2 ml-2">
                                                <span className="mr-2 text-xl">Fecha:</span>
                                                <input disabled
                                                    type="text"
                                                    name="fecha2"
                                                    value={formData.fecha2}
                                                    onChange={handleInputChange}
                                                    placeholder="_____/______/_____"
                                                    className="w-3/4 border-none underline text-xl"
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td colSpan={2} className="p-1 border-r border-black w-1/2">
                                    <div className='ml-16 mr-5'>

                                        <div className="flex  mb-2 mr-5">
                                            <div className=" ml-5 border-4 rounded-2xl border-orange-400 w-full h-24 flex items-center">
                                                <input disabled
                                                    type="text"
                                                    name="entrega"
                                                    className="w-full h-3/4 ml-5 px-2 border-none bg-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex mt-2 ml-6">
                                            <div className="relative flex items-center mb-2 w-7/12">
                                                <span className="mr-2 text-xl">Id:</span>
                                                <input disabled
                                                    type="text"
                                                    name="id55"
                                                    className="w-full border-none text-xl bg-transparent"
                                                />
                                                <div className="absolute left-0 bottom-0 w-11/12 ml-6 h-[2px] bg-black"></div>
                                            </div>

                                            <div className="flex items-center w-1/2 ml-2">
                                                <span className="mr-2 text-xl">Fecha:</span>
                                                <input disabled
                                                    type="text"
                                                    name="fecha1"
                                                    placeholder="_____/______/_____"
                                                    className="w-3/4 border-none underline text-lg"
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* Firma jefe inmediato */}
                            <tr>
                                <td colSpan={4} className="p-1 border-l border-b border-r border-black w-full">
                                    <div className="flex justify-center items-center mt-7">
                                        <div className="ml-10">
                                            <div className="flex mb-2 justify-center w-full">
                                                <div className=" border-4 rounded-2xl border-orange-400 w-[400px] h-24 flex items-center justify-center">
                                                    <input disabled
                                                        type="text"
                                                        name="firma"
                                                        className="w-3/4 h-3/4 px-2 border-none"
                                                    />
                                                </div>
                                            </div>
                                            <span className="block text-center text-lg font-bold mb-4">
                                                Firma del Jefe Inmediato
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <button onClick={captureAndShowPreview} className="bg-orange-500 hover:bg-orange-700 text-white p-2 rounded w-full mb-10" disabled={isLoading}
                >
                    {isLoading ? (

                        <FiLoader className="mr-2 animate-spin text-center mx-[850px]" />
                    ) : (
                        "Emprimir control"
                    )}
                </button>
            </div>
        </>
    );
};

export default HistorialporID;