import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PdfService } from './pdf/pdf/pdf.service';
import { InvoicesPdfService } from './pdf/invoices-pdf/invoices-pdf.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [PostsService, PdfService, InvoicesPdfService],
})
export class PostsModule {}
