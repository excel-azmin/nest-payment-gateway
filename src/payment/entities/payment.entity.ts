import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Payment {
  @Prop({ required: true })
  itemName: string;
  @Prop({ required: true })
  itemQty: number;
  @Prop({ required: true })
  itemPrice: number;
  @Prop()
  totalPrice: number;
  @Prop({ required: true })
  customer: string;
  @Prop({ default: 'USD' })
  currency: string;
  @Prop({ required: true })
  transactionID: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  source: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.pre<Payment>('save', function (next) {
  this.totalPrice = this.itemQty * this.itemPrice;
  next();
});
