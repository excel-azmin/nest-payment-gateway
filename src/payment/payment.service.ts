import { Injectable } from '@nestjs/common';
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

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const createPayment = await new this.paymentModel(createPaymentDto).save();

    console.log(createPayment.totalPrice);
    const paymentStatus = await this.stripe.paymentIntents.create({
      amount: Math.round(createPayment.totalPrice * 100),
      currency: createPayment.currency,
      description: createPayment.description,
      payment_method_types: [createPayment.source],
      confirm: false,
    });

    console.log(paymentStatus);
    return paymentStatus;
  }
}
