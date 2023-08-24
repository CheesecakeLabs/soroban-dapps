import { waitFor, fireEvent } from '@testing-library/react'
import selectEvent from 'react-select-event'

import userEvent from '@testing-library/user-event'
import sinon from 'sinon'
import * as yup from 'yup'

import { render, screen } from 'app/core/tests/utils'

import { useForm } from '.'

const CITIES = [
  {
    label: 'Florianópolis',
    value: 'floripa',
  },
]

describe('[Form]', () => {
  it('Should render all input types', () => {
    const TestComponent = (): JSX.Element => {
      const onSubmit = async (): Promise<void> => {
        return
      }

      const { Form } = useForm({ onSubmit })
      return (
        <Form>
          <Form.InputText label="Name" name="name" />
          <Form.Select label="City" name="city" options={CITIES} />
          <input type="submit" value="Submit" />
        </Form>
      )
    }
    render(<TestComponent />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('City')).toBeInTheDocument()
  })

  it('Should submit all values when fields are filled', async () => {
    const mockOnSubmit = sinon.spy()
    const TestComponent = (): JSX.Element => {
      const { Form } = useForm({ onSubmit: mockOnSubmit })
      return (
        <Form>
          <Form.InputText label="Name" name="name" />
          <Form.Select label="City" name="city" options={CITIES} />
          <input type="submit" value="Submit" />
        </Form>
      )
    }
    render(<TestComponent />)

    fireEvent.input(screen.getByLabelText('Name'), {
      target: {
        value: 'My name',
      },
    })
    await selectEvent.select(screen.getByLabelText('City'), CITIES[0].label)
    await userEvent.click(screen.getByText('Submit'))

    await waitFor(() =>
      expect(
        mockOnSubmit.alwaysCalledWith({
          name: 'My name',
          city: CITIES[0],
        })
      ).toBeTruthy()
    )
  })

  it('Should display error if inputs are invalid', async () => {
    const TestComponent = (): JSX.Element => {
      const mockOnSubmit = sinon.spy()

      const validationSchema = yup.object().shape({
        name: yup.string().required('name must be informed'),
        city: yup.string().required('city must be informed'),
      })

      const { Form } = useForm({ onSubmit: mockOnSubmit, validationSchema })
      return (
        <Form>
          <Form.InputText label="Name" name="name" />
          <Form.Select label="City" name="city" options={CITIES} />
          <input type="submit" value="Submit" />
        </Form>
      )
    }

    render(<TestComponent />)

    await userEvent.click(screen.getByText('Submit'))

    expect(await screen.findByText('name must be informed')).toBeInTheDocument()
    expect(await screen.findByText('city must be informed')).toBeInTheDocument()
  })

  it('Should fill fields with initial value', () => {
    const INITIAL_VALUES = {
      name: 'My name',
      city: CITIES[0],
    }
    const TestComponent = (): JSX.Element => {
      const onSubmit = async (): Promise<void> => {
        return
      }

      const { Form } = useForm({
        onSubmit,
        initialValues: INITIAL_VALUES,
      })
      return (
        <Form>
          <Form.InputText label="Name" name="name" />
          <Form.Select label="City" name="city" options={CITIES} />
          <input type="submit" value="Submit" />
        </Form>
      )
    }
    render(<TestComponent />)

    expect(screen.getByTestId('form')).toHaveFormValues({
      name: INITIAL_VALUES.name,
      city: INITIAL_VALUES.city.value,
    })
  })

  it('Should be able to use React Hook Forms api', async () => {
    const TestComponent = (): JSX.Element => {
      const mockOnSubmit = sinon.spy()

      const validationSchema = yup.object().shape({
        name: yup.string().required('name must be informed'),
        city: yup.string().required('city must be informed'),
      })

      const { Form, watch } = useForm({
        onSubmit: mockOnSubmit,
        validationSchema,
      })
      const name = watch('name')
      return (
        <Form>
          <span data-testid="greeting">Hi, {name}</span>
          <Form.InputText label="Name" name="name" />
          <Form.Select label="City" name="city" options={CITIES} />
          <input type="submit" value="Submit" />
        </Form>
      )
    }
    render(<TestComponent />)
    const mockedNameInput = 'My name'
    fireEvent.input(screen.getByLabelText('Name'), {
      target: {
        value: mockedNameInput,
      },
    })
    expect(screen.getByTestId('greeting')).toHaveTextContent(
      `Hi, ${mockedNameInput}`
    )
  })
})
