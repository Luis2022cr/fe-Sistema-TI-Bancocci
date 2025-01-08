// src/components/Invoice.tsx
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
}
// Declarar el módulo para agregar la propiedad `lastAutoTable` a `jsPDF`
declare module 'jspdf' {
    interface jsPDF {
        lastAutoTable: {
            finalY: number; // Cambia 'any' al tipo correcto
        };
    }
}
const Invoice: React.FC = () => {
    const [clientName, setClientName] = useState<string>('');
    const [invoiceDate] = useState<string>(new Date().toLocaleDateString());
    const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 0, unitPrice: 0 }]);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...items];
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index][field] = Number(value);
        } else {
            newItems[index][field] = value as string;
        }
        setItems(newItems);
        calculateTotal(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 0, unitPrice: 0 }]);
    };

    const calculateTotal = (items: InvoiceItem[]) => {
        const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        setTotalAmount(total);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text('Factura', 14, 10);
        doc.setFontSize(12);
        doc.text(`Nombre del Cliente: ${clientName}`, 14, 20);
        doc.text(`Fecha: ${invoiceDate}`, 14, 30);

        const tableData = items.map(item => [
            item.description,
            item.quantity,
            item.unitPrice,
            item.quantity * item.unitPrice,
        ]);

        autoTable(doc, {
            head: [['Descripción', 'Cantidad', 'Precio Unitario', 'Total']],
            body: tableData,
            startY: 40,
            styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontSize: 12,
                cellPadding: 4,
                halign: 'center',
                valign: 'middle',
            },
            headStyles: {
                fillColor: [0, 51, 102],
                textColor: [255, 255, 255],
                fontSize: 14,
                halign: 'center',
            },
        });

        // Aquí se usa lastAutoTable
        doc.text(`Total a Pagar: $${totalAmount.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
        doc.save('factura.pdf');
    };

    return (
        <div>
            <h1>Crea tu factura</h1>
            <input 
                type="text" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)} 
                placeholder="Nombre del Cliente"
                className="border p-2"
            />
            {items.map((item, index) => (
                <div key={index}>
                    <input 
                        type="text" 
                        value={item.description} 
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                        placeholder="Descripción"
                        className="border p-2 mr-2"
                    />
                    <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                        placeholder="Cantidad"
                        className="border p-2 mr-2"
                    />
                    <input 
                        type="number" 
                        value={item.unitPrice} 
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} 
                        placeholder="Precio Unitario"
                        className="border p-2 mr-2"
                    />
                </div>
            ))}
            <button onClick={addItem} className="bg-blue-500 text-white p-2 mt-2">Agregar Item</button>
            <button onClick={generatePDF} className="bg-green-500 text-white p-2 mt-2">Generar PDF</button>
        </div>
    );
};

export default Invoice;
