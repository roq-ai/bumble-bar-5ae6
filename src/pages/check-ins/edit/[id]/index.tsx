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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCheckInById, updateCheckInById } from 'apiSdk/check-ins';
import { Error } from 'components/error';
import { checkInValidationSchema } from 'validationSchema/check-ins';
import { CheckInInterface } from 'interfaces/check-in';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { EventInterface } from 'interfaces/event';
import { getUsers } from 'apiSdk/users';
import { getEvents } from 'apiSdk/events';

function CheckInEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CheckInInterface>(
    () => (id ? `/check-ins/${id}` : null),
    () => getCheckInById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CheckInInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCheckInById(id, values);
      mutate(updated);
      resetForm();
      router.push('/check-ins');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CheckInInterface>({
    initialValues: data,
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
            Edit Check In
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'check_in',
  operation: AccessOperationEnum.UPDATE,
})(CheckInEditPage);
