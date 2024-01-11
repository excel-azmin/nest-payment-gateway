import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    required: true,
    description: 'Name of the item',
    example: 'Tp-Link Router',
  })
  itemName: string;

  @ApiProperty({
    required: true,
    description: 'Quantity of the item',
    type: 'number',
    example: 2,
  })
  itemQty: number;

  @ApiProperty({
    required: true,
    description: 'Price of the item',
    type: 'number',
    example: 10.99,
  })
  itemPrice: number;

  @ApiProperty({
    required: true,
    description: 'Currenty of the payment',
    type: 'string',
    example: 'usd',
  })
  currency: string;

  @ApiProperty({
    required: true,
    description: 'Name of the customer',
    example: 'Daraz',
  })
  customer: string;

  @ApiProperty({
    description: 'A description of the payment',
    example: 'Product purchase',
  })
  description: string;

  @ApiProperty({
    description: 'The payment source token or ID',
    example: 'card',
  })
  source: string;
}
