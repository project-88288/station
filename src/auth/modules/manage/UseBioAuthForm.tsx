import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { Form, FormItem } from "components/form"
import { Input, Submit } from "components/form"
import useAuth from "../../hooks/useAuth"
import { RN_APIS, WebViewMessage } from "../../../utils/rnModule"

interface Values {
  password: string
}

const UseBioAuthForm = () => {
  const { t } = useTranslation()
  const { isUseBio, validatePassword, encodeBioAuthKey, disableBioAuth } =
    useAuth()

  /* form */
  const form = useForm<Values>()
  const { register, handleSubmit, formState, setError } = form
  const { errors } = formState

  const submitDisable = () => disableBioAuth()

  const submitAble = async ({ password }: Values) => {
    if (!password) return
    const res = await WebViewMessage(RN_APIS.AUTH_BIO)
    if (res) {
      encodeBioAuthKey(password)
    } else {
      setError("password", { type: "invalid", message: "failed bio" })
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(isUseBio ? submitDisable : submitAble)}>
        {isUseBio ? (
          <>
            Currently use bio auth
            <Submit>Disable Bio Auth</Submit>
          </>
        ) : (
          <>
            <FormItem label={t("Password")} error={errors.password?.message}>
              <Input
                {...register("password", { validate: validatePassword })}
                type="password"
                autoFocus
              />
            </FormItem>
            <Submit />
          </>
        )}
      </Form>
    </>
  )
}

export default UseBioAuthForm
