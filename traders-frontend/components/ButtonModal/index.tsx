import { useEffect, useState } from "react";
import {
  Box,
  useDisclosure,
  Button,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";

import { emitActionUser } from "../../utils/sockets";

type ButtonModalType = {
  buttonText: string;
  buttonColor: string;
  Content?: typeof MakeMarketForm | typeof BuyForm | typeof SellForm;
  submitFunction?: any;
  isGameButtonEnabled: boolean;
  minSize: number;
  maxSize: number;
};

type CardsRevealedModalType = {
  buttonText: string;
  buttonColor: string;
  cards: any[];
};

type NumericFieldType = {
  field: any;
  form: any;
  name: string;
  label: string;
  minSize?: number;
  maxSize?: number;
};

const NumericField = ({
  field,
  form,
  name,
  label,
  minSize,
  maxSize,
}: NumericFieldType) => {
  return (
    <FormControl isRequired>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {minSize !== undefined && maxSize !== undefined ? (
        <NumberInput
          min={minSize}
          max={maxSize}
          id={name}
          {...field}
          onChange={(val: any) => form.setFieldValue(field.name, val)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      ) : (
        <NumberInput
          id={name}
          {...field}
          onChange={(val: any) => form.setFieldValue(field.name, val)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )}
      <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
    </FormControl>
  );
};

const BuyForm = ({ onClose, submitFunction, minSize, maxSize }: any) => {
  return (
    <Formik
      initialValues={{ value: 10, size: minSize }}
      onSubmit={(values, actions) => {
        emitActionUser("transact", { position: "BUY", quantity: values.size });
        actions.setSubmitting(false);
        onClose();
      }}
    >
      {(props) => (
        <Form>
          <ModalBody>
            <Stack gap={1}>
              <Field name="size">
                {({ field, form }: any) => (
                  <NumericField
                    field={field}
                    form={form}
                    name="size"
                    label="Size"
                    minSize={minSize}
                    maxSize={maxSize}
                  />
                )}
              </Field>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={props.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
};

const SellForm = ({ onClose, submitFunction, minSize, maxSize }: any) => {
  return (
    <Formik
      initialValues={{ value: 10, size: minSize }}
      onSubmit={(values, actions) => {
        emitActionUser("transact", { position: "SELL", quantity: values.size });
        actions.setSubmitting(false);
        onClose();
      }}
    >
      {(props) => (
        <Form>
          <ModalBody>
            <Stack gap={1}>
              <Field name="size">
                {({ field, form }: any) => (
                  <NumericField
                    field={field}
                    form={form}
                    name="size"
                    label="Size"
                    minSize={minSize}
                    maxSize={maxSize}
                  />
                )}
              </Field>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={props.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
};

const MakeMarketForm = ({ onClose, submitFunction, minSize, maxSize }: any) => {
  return (
    <Formik
      initialValues={{
        bidValue: 10,
        bidSize: minSize,
        askValue: 10,
        askSize: minSize,
      }}
      onSubmit={(values, actions) => {
        emitActionUser("makeMarket", {
          bid: values.bidValue,
          bid_lots: values.bidSize,
          ask: values.askValue,
          ask_lots: values.askSize,
        });
        actions.setSubmitting(false);
        onClose();
      }}
    >
      {(props) => (
        <Form>
          <ModalBody>
            <Stack gap={1}>
              <Stack direction={"row"} gap={1}>
                <Field name="bidValue">
                  {({ field, form }: any) => (
                    <NumericField
                      field={field}
                      form={form}
                      name="bidValue"
                      label="Bid Value"
                    />
                  )}
                </Field>
                <Field name="bidSize">
                  {({ field, form }: any) => (
                    <NumericField
                      field={field}
                      form={form}
                      name="bidSize"
                      label="Bid Size"
                      minSize={minSize}
                      maxSize={maxSize}
                    />
                  )}
                </Field>
              </Stack>
              <Stack direction={"row"} gap={1}>
                <Field name="askValue">
                  {({ field, form }: any) => (
                    <NumericField
                      field={field}
                      form={form}
                      name="askValue"
                      label="Ask Value"
                    />
                  )}
                </Field>
                <Field name="askSize">
                  {({ field, form }: any) => (
                    <NumericField
                      field={field}
                      form={form}
                      name="askSize"
                      label="Ask Size"
                      minSize={minSize}
                      maxSize={maxSize}
                    />
                  )}
                </Field>
              </Stack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={props.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
};

const ButtonModal = ({
  buttonText,
  buttonColor,
  Content,
  submitFunction,
  isGameButtonEnabled,
  minSize,
  maxSize,
}: ButtonModalType) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button
        onClick={onOpen}
        bg={buttonColor}
        isDisabled={!isGameButtonEnabled}
      >
        {buttonText}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{buttonText}</ModalHeader>
          <ModalCloseButton />
          {Content && (
            <Content
              onClose={onClose}
              submitFunction={submitFunction}
              minSize={minSize}
              maxSize={maxSize}
            />
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

const BuyModal = ({
  submitFunction,
  isGameButtonEnabled,
  minLots,
  maxLots,
}: any) => {
  return (
    <ButtonModal
      buttonText="Buy"
      buttonColor="green"
      Content={BuyForm}
      submitFunction={submitFunction}
      isGameButtonEnabled={isGameButtonEnabled}
      minSize={minLots}
      maxSize={maxLots}
    />
  );
};

const SellModal = ({
  submitFunction,
  isGameButtonEnabled,
  minLots,
  maxLots,
}: any) => {
  return (
    <ButtonModal
      buttonText="Sell"
      buttonColor="red"
      Content={SellForm}
      submitFunction={submitFunction}
      isGameButtonEnabled={isGameButtonEnabled}
      minSize={minLots}
      maxSize={maxLots}
    />
  );
};

const MakeMarketModal = ({
  submitFunction,
  isGameButtonEnabled,
  minLots,
  maxLots,
}: any) => {
  return (
    <ButtonModal
      buttonText="Make Market"
      buttonColor="orange"
      Content={MakeMarketForm}
      submitFunction={submitFunction}
      isGameButtonEnabled={isGameButtonEnabled}
      minSize={minLots}
      maxSize={maxLots}
    />
  );
};

const CardsRevealedModal = ({
  buttonText,
  buttonColor,
  cards,
}: CardsRevealedModalType) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [ isNewCards, setIsNewCards ] = useState(false);

  const closeRevealModal = () => {
    setIsNewCards(false);
    onClose();
  }

  useEffect(() => {
    setIsNewCards(true);
  }, [cards]);

  return (
    <Box>
      <Button onClick={onOpen} bg={buttonColor} border='2px' borderColor={isNewCards ? 'red' : buttonColor} >
        {buttonText}
      </Button>
      <Modal isOpen={isOpen} onClose={closeRevealModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{buttonText}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack gap={1} mb={2}>
              <Text>
                {cards.length > 0
                  ? cards.sort((a, b) => a - b).join(", ")
                  : "No cards revealed yet"}
              </Text>
            </Stack>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme='blue' mr={3} isLoading={props.isSubmitting} type='submit'>
              Submit
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancel</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export {
  ButtonModal as default,
  BuyModal,
  SellModal,
  MakeMarketModal,
  CardsRevealedModal,
  NumericField
};
