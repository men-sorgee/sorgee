import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  HStack,
  Link,
  List,
  ListItem,
  OrderedList,
  SimpleGrid,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  FieldCheckbox,
  FieldCheckboxes,
  FieldDate,
  FieldInput,
  FieldNumber,
  FieldRadioButtons,
  FieldSelect,
  FieldSwitch,
  FieldText,
} from '../components/forms'
import FieldRange from '../components/forms/FieldRange'
import Page from '../components/Page'
import { LinkButton, Loading } from '../components/ui'

const Form = () => {
  const methods = useForm()
  return (
    <FormProvider {...methods}>
      <form>
        <SimpleGrid columns={[1, 1, 2]}>
          <FieldInput field="name" label="Name" />
          <FieldSelect
            field="choices"
            label="Choices"
            options={[
              { text: 'One', value: '1' },
              { text: 'Two', value: '2' },
            ]}
          />
          <FieldCheckbox field="checkbox" label="Checkbox" />
          <FieldDate field="date" label="Date" />
          <FieldNumber field="number" label="Number" />
          <FieldCheckboxes
            field="checkboxes"
            label="Checkboxes"
            options={[
              { text: 'One', value: '1' },
              { text: 'Two', value: '2' },
            ]}
          />
          <FieldRadioButtons
            field="radios"
            label="Radios"
            options={[
              { text: 'One', value: '1' },
              { text: 'Two', value: '2' },
            ]}
          />
          <FieldRange field="range" label="Range" />
          <FieldSwitch field="switch" label="Switch" />
          <FieldText field="text" label="Text" />
        </SimpleGrid>
      </form>
    </FormProvider>
  )
}
export default function Styles() {
  const text = 'lorum ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.'
  const getText = (n = 1) => {
    let l = text
    for (let i = 0; i < n; i++) {
      l += ' ' + text
    }
    return l
  }

  return (
    <Page title="Heading 1">
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <Text size="lg">Text LG {getText(2)}</Text>
      <h6>Ordered List</h6>
      <OrderedList>
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
        <ListItem>Item 3</ListItem>
      </OrderedList>
      <h3>Heading 3</h3>
      <Text>Text {getText(5)}</Text>
      <h4>Heading 4</h4>
      <Text size="md">Text MD {getText(5)}</Text>
      <h5>Unordered List</h5>
      <UnorderedList>
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
        <ListItem>Item 3</ListItem>
      </UnorderedList>
      <h5>Heading 5</h5>
      <Text size="xl">Text XL {getText(3)}</Text>
      <h6>List</h6>
      <List>
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
        <ListItem>Item 3</ListItem>
      </List>
      <Card>
        <CardHeader>
          <h2>Card Heading</h2>
        </CardHeader>
        <CardBody>
          <Text>{text}</Text>
          <Form />

          <Link>Some Links</Link>
        </CardBody>
        <CardFooter as={HStack} spacing={2}>
          <LinkButton href="#">Link Button</LinkButton>
          <LinkButton href="#" colorScheme="primary">
            Link Button Primary
          </LinkButton>
          <LinkButton href="#" colorScheme="secondary">
            Link Button Secondary
          </LinkButton>
          <LinkButton href="#" colorScheme="accent">
            Link Button Accent
          </LinkButton>
          <LinkButton href="#" colorScheme="ghost">
            Link Button Ghost
          </LinkButton>
        </CardFooter>
      </Card>

      <Box>
        <h2>Heading 2</h2>
        <Form />
        <Box as={HStack} spacing={2}>
          <Button size="sm" colorScheme="primary">
            SM Button Primary
          </Button>
          <Button> Button</Button>
          <Button size="md" colorScheme="secondary">
            MD Button Secondary
          </Button>
          <Button size="lg" colorScheme="accent">
            LG Button Accent
          </Button>
          <Button size="lg" colorScheme="ghost">
            LG Button Ghost
          </Button>
        </Box>
      </Box>
      <Loading />
    </Page>
  )
}
