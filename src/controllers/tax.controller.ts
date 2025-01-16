import { Response } from "express";
import { CustomRequest } from "../interfaces/custom-request.interface";
import { ApiResponse } from "../helpers/api-response";
import Tax from "../models/tax.model";
import { TaxFormSchema } from "../schemas/tax.schema";

export const CreateNewTax = async (req: CustomRequest, res: Response) => {
  try {
    const { userId, params, body } = req;

    const fields = TaxFormSchema.safeParse(body);

    if (!fields.success) {
      res
        .status(400)
        .json(ApiResponse("Missing or Invalid input fields!", false));
      return;
    }

    const { name, percentage, applicableCategories } = fields.data;

    const existingTax = await Tax.findOne({
      propertyRef: params.propertyId,
      name: name.trim(),
    });

    if (existingTax) {
      res
        .status(409)
        .json(ApiResponse("A tax with this name already exists!", false));
      return;
    }

    const tax = await Tax.create({
      name,
      percentage,
      applicableCategories,
      propertyRef: params.propertyId,
      createdBy: userId,
    });

    res.status(201).json(ApiResponse("Tax created successfully!", true, tax));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const UpdateTax = async (req: CustomRequest, res: Response) => {
  try {
    const { params, body } = req;

    const fields = TaxFormSchema.safeParse(body);

    if (!fields.success) {
      res
        .status(400)
        .json(ApiResponse("Missing or Invalid input fields!", false));
      return;
    }

    const { name, percentage, applicableCategories } = fields.data;

    const tax = await Tax.findOneAndUpdate(
      {
        propertyRef: params.propertyId,
        _id: params.taxId,
      },
      {
        $set: {
          name,
          percentage,
          applicableCategories,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(ApiResponse("Tax updated successfully!", true, tax));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GetAllTaxes = async (req: CustomRequest, res: Response) => {
  try {
    const { params } = req;

    const taxes = await Tax.find({
      propertyRef: params.propertyId,
    });

    res
      .status(200)
      .json(ApiResponse("Taxes fetched successfully!", true, taxes));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
