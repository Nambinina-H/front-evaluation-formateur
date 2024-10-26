import React from 'react'
import { CFooter } from '@coreui/react-pro'

const AppFooter = () => {
  return (
    <CFooter className="px-4 text-center">
      <div className="w-100">
          Evaluation Formateur
        <span className="ms-1">&copy; 2024 LaVilla.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)