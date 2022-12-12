import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesPdfService } from './invoices-pdf.service';

describe('InvoicesPdfService', () => {
  let service: InvoicesPdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicesPdfService],
    }).compile();

    service = module.get<InvoicesPdfService>(InvoicesPdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
