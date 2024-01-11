import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { stripeConfig } from 'src/config/stripe.config';
import Stripe from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  private stripe;

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
  ) {
    this.stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<any> {
    try {
      const paymentStatus = await this.stripe.paymentIntents.create({
        amount: Math.round(
          createPaymentDto.itemQty * createPaymentDto.itemPrice * 100,
        ),
        currency: createPaymentDto.currency,
        description: createPaymentDto.description,
        payment_method_types: [createPaymentDto.source],
        confirm: false,
      });

      const createPayment = await new this.paymentModel(createPaymentDto);
      createPayment.transactionID = paymentStatus.id;
      const payload = await createPayment.save();
      console.log(payload);
      return {
        status: 'Success',
        statusCode: HttpStatus.CREATED,
        payload,
      };
    } catch (error) {
      return {
        status: 'Failed',
        statusCode: error.statusCode,
        error: error.message,
      };
    }
  }
}
