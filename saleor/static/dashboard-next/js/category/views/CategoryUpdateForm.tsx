import Grid from "material-ui/Grid";
import { CircularProgress } from "material-ui/Progress";
import * as React from "react";
import { Redirect } from "react-router-dom";

import BaseCategoryForm from "../components/BaseForm";
import ErrorMessageCard from "../../components/cards/ErrorMessageCard";
import { TypedCategoryDetailsQuery, categoryDetailsQuery } from "../queries";
import {
  TypedCategoryUpdateMutation,
  categoryUpdateMutation
} from "../mutations";
import { categoryShowUrl } from "../index";
import i18n from "../../i18n";
import PageHeader from "../../components/PageHeader";

interface CategoryUpdateFormProps {
  id: string;
}

export const CategoryUpdateForm: React.StatelessComponent<
  CategoryUpdateFormProps
> = ({ id }) => (
  <TypedCategoryDetailsQuery query={categoryDetailsQuery} variables={{ id }}>
    {({ data, loading, error }) => {
      if (error) {
        console.error(error.message);
        return <ErrorMessageCard message={error.message} />;
      }
      const { category } = data;

      return (
        <>
          <PageHeader
            backLink={categoryShowUrl(id)}
            title={i18n.t("Edit category", { context: "title" })}
          />
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={24}>
              <Grid item xs={12} md={9}>
                <TypedCategoryUpdateMutation mutation={categoryUpdateMutation}>
                  {(mutate, result) => {
                    if (
                      result &&
                      !result.loading &&
                      result.data.categoryUpdate.errors.length === 0
                    ) {
                      return (
                        <Redirect
                          to={categoryShowUrl(
                            result.data.categoryUpdate.category.id
                          )}
                        />
                      );
                    }
                    return (
                      <BaseCategoryForm
                        title={i18n.t("Edit category", { context: "title" })}
                        name={category.name}
                        description={category.description}
                        handleConfirm={formData =>
                          mutate({
                            variables: {
                              ...formData,
                              id
                            }
                          })
                        }
                        confirmButtonLabel={i18n.t("Save", {
                          context: "button"
                        })}
                        errors={
                          result && !result.loading
                            ? result.data.categoryUpdate.errors
                            : []
                        }
                      />
                    );
                  }}
                </TypedCategoryUpdateMutation>
              </Grid>
            </Grid>
          )}
        </>
      );
    }}
  </TypedCategoryDetailsQuery>
);