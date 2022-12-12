/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
// import * as fs from 'fs';

@Injectable()
export class InvoicesPdfService {
  async generatePDF(invoice, path): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      this.generateHeader(doc);
      this.generateCustomerInformation(doc, invoice);
      this.generateInvoiceTable(doc, invoice);
      this.generateFooter(doc);

      doc.end();
      // doc.pipe(fs.createWriteStream(path));
      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });
    return pdfBuffer;
  }

  generateHeader(doc) {
    doc
      .image('posts-logo.png', 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(20)
      .text('ACME Inc.', 110, 57)
      .fontSize(10)
      .text('ACME Inc.', 200, 50, { align: 'right' })
      .text('123 Main Street', 200, 65, { align: 'right' })
      .text('New York, NY, 10025', 200, 80, { align: 'right' })
      .moveDown();
  }

  generateCustomerInformation(doc, invoice) {
    doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      .text('Invoice Number:', 50, customerInformationTop)
      .font('Helvetica-Bold')
      .text(invoice.invoice_nr, 150, customerInformationTop)
      .font('Helvetica')
      .text('Invoice Date:', 50, customerInformationTop + 15)
      .text(this.formatDate(new Date()), 150, customerInformationTop + 15)
      .text('Balance Due:', 50, customerInformationTop + 30)
      .text(
        this.formatCurrency(invoice.subtotal - invoice.paid),
        150,
        customerInformationTop + 30,
      )

      .font('Helvetica-Bold')
      .text(invoice.shipping.name, 300, customerInformationTop)
      .font('Helvetica')
      .text(invoice.shipping.address, 300, customerInformationTop + 15)
      .text(
        invoice.shipping.city +
          ', ' +
          invoice.shipping.state +
          ', ' +
          invoice.shipping.country,
        300,
        customerInformationTop + 30,
      )
      .moveDown();

    this.generateHr(doc, 252);
  }

  generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      invoiceTableTop,
      'Item',
      'Description',
      'Unit Cost',
      'Quantity',
      'Line Total',
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    for (i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        item.item,
        item.description,
        this.formatCurrency(item.amount / item.quantity),
        item.quantity,
        this.formatCurrency(item.amount),
      );

      this.generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    this.generateTableRow(
      doc,
      subtotalPosition,
      '',
      '',
      'Subtotal',
      '',
      this.formatCurrency(invoice.subtotal),
    );

    const paidToDatePosition = subtotalPosition + 20;
    this.generateTableRow(
      doc,
      paidToDatePosition,
      '',
      '',
      'Paid To Date',
      '',
      this.formatCurrency(invoice.paid),
    );

    const duePosition = paidToDatePosition + 25;
    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      duePosition,
      '',
      '',
      'Balance Due',
      '',
      this.formatCurrency(invoice.subtotal - invoice.paid),
    );
    doc.font('Helvetica');
  }

  generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        'Payment is due within 15 days. Thank you for your business.',
        50,
        780,
        { align: 'center', width: 500 },
      );
  }

  generateTableRow(doc, y, item, description, unitCost, quantity, lineTotal) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: 'right' })
      .text(quantity, 370, y, { width: 90, align: 'right' })
      .text(lineTotal, 0, y, { align: 'right' });
  }

  generateHr(doc, y) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  formatCurrency(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + '/' + month + '/' + day;
  }

  // =====================================================
  //   async generatePDF(/* user: User */): Promise<Buffer> {

  //     const pdfBuffer: Buffer = await new Promise(async (resolve) => {
  //       const doc = new PDFDocument({
  //         size: 'LETTER',
  //         bufferPages: true,
  //       });
  //       /* const posts = await this.postsService.findAllPosts(user);
  //         for(const post in posts) {

  //         } */

  //       // customize your PDF document
  //       /* doc.text('hello world', 100, 50)
  //           doc.end() */
  //       doc.lineCap('butt').moveTo(270, 90).lineTo(270, 230).stroke();
  //       doc.lineCap('butt').moveTo(320, 90).lineTo(320, 230).stroke();

  //       this.row(doc, 90);
  //       this.row(doc, 110);
  //       this.row(doc, 130);
  //       this.row(doc, 150);
  //       this.row(doc, 170);
  //       this.row(doc, 190);
  //       this.row(doc, 210);

  //       this.textInRowFirst(doc, 'Nombre o razón social', 100);
  //       this.textInRowFirst(doc, 'RUT', 120);
  //       this.textInRowFirst(doc, 'Dirección', 140);
  //       this.textInRowFirst(doc, 'Comuna', 160);
  //       this.textInRowFirst(doc, 'Ciudad', 180);
  //       this.textInRowFirst(doc, 'Telefono', 200);
  //       this.textInRowFirst(doc, 'e-mail', 220);

  //       doc.end();

  //       const buffer = [];
  //       doc.on('data', buffer.push.bind(buffer));
  //       doc.on('end', () => {
  //         const data = Buffer.concat(buffer);
  //         resolve(data);
  //       });
  //     });

  //     return pdfBuffer;
  //   }

  //   textInRowFirst(doc, text, heigth) {
  //     doc.y = heigth;
  //     doc.x = 30;
  //     doc.fillColor('black');
  //     doc.text(text, {
  //       paragraphGap: 5,
  //       indent: 5,
  //       align: 'justify',
  //       columns: 1,
  //     });
  //     return doc;
  //   }

  //   row(doc, heigth) {
  //     doc.lineJoin('miter').rect(30, heigth, 500, 20).stroke();
  //     return doc;
  //   }
}
