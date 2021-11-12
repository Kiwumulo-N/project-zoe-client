import React from "react";
import * as yup from "yup";
import { reqString } from "../../../data/validations";
import { FormikHelpers } from "formik";
import Grid from "@material-ui/core/Grid";
import XForm from "../../../components/forms/XForm";
import XTextInput from "../../../components/inputs/XTextInput";
import { remoteRoutes } from "../../../data/constants";

import { handleSubmission, ISubmission } from "../../../utils/formHelpers";
import { hasValue } from "../../../components/inputs/inputHelpers";

interface IProps {
  data?: any | null;
  isNew: boolean;
  onCreated?: (g: any) => any;
  onUpdated?: (g: any) => any;
  done?: () => any;
}

const schema = yup.object().shape({
  name: reqString,
});

const initialValues = {
  name: "",
};

const NewGroupCategories = ({
  data,
  isNew,
  onCreated,
  onUpdated,
  done,
}: IProps) => {
  function toLowerCase(s: string) {
    return s[0].toUpperCase() + s.slice(1);
  }

  function removeStringSpaces(s: string) {
    return s.replace(/\s+/g, "");
  }

  function handleSubmit(values: any, actions: FormikHelpers<any>) {
    const removeAllSpaces = removeStringSpaces(values.name);
    const categoryId = toLowerCase(removeAllSpaces);
    let toSave;
    if (hasValue(data)) {
      toSave = {
        id: values.id,
        name: values.name,
      };
    } else {
      toSave = {
        id: categoryId,
        name: values.name,
      };
    }

    const submission: ISubmission = {
      url: remoteRoutes.groupsCategories,
      values: toSave,
      actions,
      isNew,
      onAjaxComplete: (data: any) => {
        if (isNew) {
          onCreated && onCreated(data);
        } else {
          onUpdated && onUpdated(data);
          if (done) done();
          window.location.reload();
        }
        actions.resetForm();
        actions.setSubmitting(false);
      },
    };
    handleSubmission(submission);
    if (done) done();
  }

  return (
    <XForm
      onSubmit={handleSubmit}
      schema={schema}
      initialValues={{ ...initialValues, ...data.value }}
      onCancel={done}
    >
      <Grid spacing={2} container className="min-width-100">
        <Grid item xs={12}>
          <XTextInput
            name="name"
            label="Category Name"
            type="text"
            variant="outlined"
            margin="none"
          />
        </Grid>
      </Grid>
    </XForm>
  );
};

export default NewGroupCategories;
