import { useTranslation } from "react-i18next"
import { Card, Page } from "components/layout"
import AddLedgerForm from "./AddLedgerForm"

const AddLedgerPage = () => {
  const { t } = useTranslation()

  return (
    <Page title={t("add ledger")} small>
      <Card>
        <AddLedgerForm />
      </Card>
    </Page>
  )
}

export default AddLedgerPage
