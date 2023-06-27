import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCheckIn } from 'apiSdk/check-ins';
import { Error } from 'components/error';
import { checkInValidationSchema } from 'validationSchema/check-ins';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { EventInterface } from 'interfaces/event';
import { getUsers } from 'apiSdk/users';
import { getEvents } from 'apiSdk/events';
import { CheckInInterface } from 'interfaces/check-in';

function CheckInCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CheckInInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCheckIn(values);
      resetForm();
      router.push('/check-ins');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CheckInInterface>({
    initialValues: {
      drink_coupons: 0,
      user_id: (router.query.user_id as string) ?? null,
      event_id: (router.query.event_id as string) ?? null,
    },
    validationSchema: checkInValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Check In
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="drink_coupons" mb="4" isInvalid={!!formik.errors?.drink_coupons}>
            <FormLabel>Drink Coupons</FormLabel>
            <NumberInput
              name="drink_coupons"
              value={formik.values?.drink_coupons}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('drink_coupons', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.drink_coupons && <FormErrorMessage>{formik.errors?.drink_coupons}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<EventInterface>
            formik={formik}
            name={'event_id'}
            label={'Select Event'}
            placeholder={'Select Event'}
            fetcher={getEvents}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'check_in',
  operation: AccessOperationEnum.CREATE,
})(CheckInCreatePage);
