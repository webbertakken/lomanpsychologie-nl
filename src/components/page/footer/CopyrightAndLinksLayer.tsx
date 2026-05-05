import { useContext } from 'react'
import MenuItems from '../../menu/MenuItems'
import { AppContext } from '../context/AppContext'

interface Props {}

const CopyrightAndLinksLayer = ({}: Props): JSX.Element => {
  const { footerMenu: menu } = useContext(AppContext)

  return (
    <div className="flex flex-col justify-between text-center lg:flex-row p-2 gap-2">
      <div className="order-last text-sm text-gray-400 lg:order-first flex justify-center gap-4 md:gap-1 flex-col md:flex-row">
        <hr className="md:invisible my-4 border-gray-400/40" />
        <div>
          <strong>Loman Psychologiepraktijk</strong>
          <strong className="invisible md:visible"> |</strong>
        </div>
        <div>
          <span>Alle rechten voorbehouden</span>
        </div>
      </div>
      <MenuItems
        menu={menu}
        ariaLabel="Footer navigation"
        className="flex flex-col gap-4 md:flex-row justify-center pb-0 -ml-4 -mr-4 text-sm"
        itemClassName="text-gray-400 hover:text-gray-300"
      />
    </div>
  )
}

export default CopyrightAndLinksLayer
