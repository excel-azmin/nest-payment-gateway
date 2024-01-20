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
    this.stripe = new Stripe(stripeConfig.secretKey);
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<any> {
    try {
      const paymentStatus = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: createPaymentDto.itemName,
                images: ['https://i.imgur.com/EHyR2nP.png'],
              },
              unit_amount: createPaymentDto.itemPrice * 100,
            },
            quantity: createPaymentDto.itemQty,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:300/success`,
        cancel_url: `http://localhost:300/cancel`,
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
