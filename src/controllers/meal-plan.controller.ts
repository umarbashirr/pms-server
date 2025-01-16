import { Response } from "express";
import { CustomRequest } from "../interfaces/custom-request.interface";
import { ApiResponse } from "../helpers/api-response";
import { MealPlanFormSchema } from "../schemas/MealPlanFormSchema";
import MealPlan from "../models/meal-plan.model";

export const CreateNewMealPlan = async (req: CustomRequest, res: Response) => {
  try {
    const { userId, params, body } = req;

    const fields = MealPlanFormSchema.safeParse(body);

    if (!fields.success) {
      res
        .status(400)
        .json(ApiResponse("Missing or Invalid input fields!", false));
      return;
    }

    const { name, code, description, price } = fields.data;

    const existingPlan = await MealPlan.findOne({
      propertyRef: params.propertyId,
      code: code.toUpperCase(),
    });

    if (existingPlan) {
      res
        .status(409)
        .json(ApiResponse("Plan already created using same code!", false));
      return;
    }

    const plan = await MealPlan.create({
      name,
      code,
      description,
      price,
      propertyRef: params.propertyId,
      createdBy: userId,
    });

    res.status(201).json(ApiResponse("Plan created successfully!", true, plan));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const UpdateMealPlan = async (req: CustomRequest, res: Response) => {
  try {
    const { params, body } = req;

    const fields = MealPlanFormSchema.safeParse(body);

    if (!fields.success) {
      res
        .status(400)
        .json(ApiResponse("Missing or Invalid input fields!", false));
      return;
    }

    const { name, code, description, price } = fields.data;

    const plan = await MealPlan.findOneAndUpdate(
      {
        propertyRef: params.propertyId,
        _id: params.mealPlanId,
      },
      {
        $set: {
          name,
          code,
          description,
          price,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(ApiResponse("Plan updated successfully!", true, plan));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GetAllMealPlans = async (req: CustomRequest, res: Response) => {
  try {
    const { params } = req;

    const plans = await MealPlan.find({
      propertyRef: params.propertyId,
    });

    res
      .status(200)
      .json(ApiResponse("Plan fetched successfully!", true, plans));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
