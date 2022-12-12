import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfService } from './pdf/pdf/pdf.service';
import { InvoicesPdfService } from './pdf/invoices-pdf/invoices-pdf.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService, PdfService, InvoicesPdfService],
})
export class PostsModule {}
