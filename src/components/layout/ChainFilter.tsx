import classNames from "classnames"
import { useNetwork } from "data/wallet"
import { useState, memo, useMemo } from "react"
import { useTranslation } from "react-i18next"
import styles from "./ChainFilter.module.scss"
import { useSavedChain } from "utils/localStorage"
import { isTerraChain } from "utils/chain"
import { OtherChainsButton } from "components/layout"
import { useSortedDisplayChains } from "utils/chain"
import { DISPLAY_CHAINS_MAX } from "config/constants"
import { useSelectedDisplayChain } from "utils/localStorage"

type Props = {
  children: (chain?: string) => React.ReactNode
  all?: boolean
  outside?: boolean
  title?: string
  className?: string
  terraOnly?: boolean
}

const cx = classNames.bind(styles)

const ChainFilter = ({
  children,
  all,
  outside,
  title,
  className,
  terraOnly,
}: Props) => {
  const { t } = useTranslation()
  const { savedChain, changeSavedChain } = useSavedChain()
  const network = useNetwork()
  const { selectedDisplayChain } = useSelectedDisplayChain()
  const sortedDisplayChains = useSortedDisplayChains()

  console.log("selectedDisplayChain", selectedDisplayChain)

  const networks = useMemo(
    () =>
      sortedDisplayChains
        .map((id) => network[id])
        .filter((n) => (terraOnly ? isTerraChain(n.prefix) : true)),
    [network, sortedDisplayChains, terraOnly]
  )
  console.log("networks", networks)

  const networksToShow = useMemo(() => {
    let toShow
    if (selectedDisplayChain) {
      toShow = [
        ...networks.slice(0, DISPLAY_CHAINS_MAX - 1),
        network[selectedDisplayChain],
      ]
    } else {
      toShow = networks.slice(0, DISPLAY_CHAINS_MAX)
    }
    return Array.from(new Set(toShow))
  }, [networks, network, selectedDisplayChain])

  const otherNetworks = useMemo(
    () => Object.values(network).filter((n) => !networksToShow.includes(n)),
    [network, networksToShow]
  )

  const initNetwork =
    networks.find((n) => n.chainID === savedChain) ?? networks[0]

  const [selectedChain, setChain] = useState<string | undefined>(
    all ? undefined : initNetwork?.chainID
  )

  const handleSetChain = (chain: string | undefined) => {
    setChain(chain)
    if (terraOnly) return
    changeSavedChain(chain)
  }

  return (
    <div className={outside ? styles.chainfilter__out : styles.chainfilter}>
      <div
        className={cx(className, styles.header, terraOnly ? styles.swap : "")}
      >
        {title && <h1>{title}</h1>}
        <div className={styles.pills}>
          {all && (
            <button
              onClick={() => handleSetChain(undefined)}
              className={cx(
                styles.all,
                styles.button,
                selectedChain ?? styles.active
              )}
            >
              {t("All")}
            </button>
          )}
          {networksToShow.map((c) => (
            <button
              key={c.chainID}
              onClick={() => handleSetChain(c.chainID)}
              className={cx(
                styles.button,
                selectedChain === c.chainID ? styles.active : undefined
              )}
            >
              <img src={c.icon} alt={c.name} />
              {c.name}
            </button>
          ))}
          {!terraOnly && <OtherChainsButton list={otherNetworks} />}
        </div>
      </div>
      <div className={styles.content}>{children(selectedChain)}</div>
    </div>
  )
}

export default memo(ChainFilter)
