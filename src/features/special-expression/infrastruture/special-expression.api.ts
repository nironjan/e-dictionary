import apiClient from "../../../lib/api/api-client";

import type { SpecialExpressionFormValues } from "../domain/schemas/special-expression.schema";

import type {
  SpecialExpression,
  SpecialExpressionListResponse,
  SpecialExpressionTranslation,
} from "../domain/types/special-expression.type";

import type { SpecialExpressionListQuery } from "../domain/types/special-expression-query.type";

import type { SpecialExpressionTranslationForm } from "../domain/types/special-expression-form.type";
import { buildSpecialExpressionQuery } from "./special-expression.quey";
import { SPECIAL_EXPRESSION_ENDPOINTS } from "./special-expression.endpoints";

export const specialExpressionApi = {
  // ---------------------------------------------------------------------------
  // Special expressions
  // ---------------------------------------------------------------------------

  async findAll(
    query: SpecialExpressionListQuery,
  ): Promise<SpecialExpressionListResponse> {
    const params = buildSpecialExpressionQuery(query);

    return apiClient.get<SpecialExpressionListResponse>(
      SPECIAL_EXPRESSION_ENDPOINTS.admin.list,
      {
        params,
      },
    );
  },

  async findOne(id: string): Promise<SpecialExpression> {
    return apiClient.get<SpecialExpression>(
      SPECIAL_EXPRESSION_ENDPOINTS.admin.byId(id),
    );
  },

  async create(data: SpecialExpressionFormValues): Promise<SpecialExpression> {
    return apiClient.post<SpecialExpression>(
      SPECIAL_EXPRESSION_ENDPOINTS.admin.create,
      data,
    );
  },

  async update(
    id: string,
    data: SpecialExpressionFormValues,
  ): Promise<SpecialExpression> {
    return apiClient.patch<SpecialExpression>(
      SPECIAL_EXPRESSION_ENDPOINTS.admin.update(id),
      data,
    );
  },

  async updateVerification(
    id: string,
    isVerified: boolean,
  ): Promise<SpecialExpression> {
    return apiClient.patch<SpecialExpression>(
      SPECIAL_EXPRESSION_ENDPOINTS.admin.verification(id),
      {
        isVerified,
      },
    );
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(SPECIAL_EXPRESSION_ENDPOINTS.admin.delete(id));
  },

  // ---------------------------------------------------------------------------
  // Translations
  // ---------------------------------------------------------------------------

  async addTranslation(
    expressionId: string,
    data: SpecialExpressionTranslationForm,
  ): Promise<SpecialExpressionTranslation> {
    return apiClient.post<SpecialExpressionTranslation>(
      SPECIAL_EXPRESSION_ENDPOINTS.admin.translations.create(expressionId),
      data,
    );
  },

  async updateTranslation(
    expressionId: string,
    translationId: string,
    data: SpecialExpressionTranslationForm,
  ): Promise<SpecialExpressionTranslation> {
    return apiClient.patch<SpecialExpressionTranslation>(
      SPECIAL_EXPRESSION_ENDPOINTS.admin.translations.update(
        expressionId,
        translationId,
      ),
      data,
    );
  },

  async removeTranslation(
    expressionId: string,
    translationId: string,
  ): Promise<void> {
    await apiClient.delete(
      SPECIAL_EXPRESSION_ENDPOINTS.admin.translations.delete(
        expressionId,
        translationId,
      ),
    );
  },
};
