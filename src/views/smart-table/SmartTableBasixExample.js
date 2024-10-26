import React, { useState, useEffect } from 'react'
import { CBadge, CButton, CCardBody, CCollapse, CSmartTable } from '@coreui/react-pro'
import { getData } from '../../services/apiService' // Import the getData function

const SmartTableBasicExample = () => {
  const [details, setDetails] = useState([])
  const [data, setData] = useState([]) // State to store fetched data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData('utilisateur/utilisateurs/')
        setData(response)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const columns = [
    { key: 'nom', label: 'Nom', _style: { width: '20%' } },
    { key: 'prenom', label: 'Prénom', _style: { width: '20%' } },
    { key: 'email', label: 'Email', _style: { width: '20%' } },
    { key: 'tel', label: 'Téléphone', _style: { width: '15%' } },
    { key: 'type', label: 'Type', _style: { width: '10%' } },
    { key: 'is_active', label: 'Statut', _style: { width: '10%' } },
    {
      key: 'show_details',
      label: '',
      _style: { width: '5%' },
      filter: false,
      sorter: false,
    },
  ]

  const getBadge = (isActive) => {
    return isActive ? 'success' : 'secondary'
  }

  const toggleDetails = (index) => {
    const position = details.indexOf(index)
    let newDetails = details.slice()
    if (position !== -1) {
      newDetails.splice(position, 1)
    } else {
      newDetails = [...details, index]
    }
    setDetails(newDetails)
  }

  return (
    <CSmartTable
      sorterValue={{ column: 'nom', state: 'asc' }}
      clickableRows
      tableProps={{
        striped: true,
        hover: true,
      }}
      activePage={3}
      items={data} // Use fetched data
      columns={columns}
      columnFilter
      tableFilter
      cleaner
      itemsPerPageSelect
      itemsPerPage={5}
      columnSorter
      pagination
      itemsPerPageLabel="Éléments par page" // Translate "Items per page" to French
      paginationProps={{
        align: 'center', // Center the pagination
        style: { marginLeft: '250px' }, // Add margin to the right
      }}
      scopedColumns={{
        is_active: (item) => (
          <td>
        <CBadge color={getBadge(item.is_active)}>{item.is_active ? 'Active' : 'Inactive'}</CBadge>
          </td>
        ),
        show_details: (item) => {
          return (
            <td className="py-2">
              <CButton
                color="primary"
                variant="outline"
                shape="square"
                size="sm"
                onClick={() => {
                  toggleDetails(item.id)
                }}
              >
                {details.includes(item.id) ? 'Hide' : 'Show'}
              </CButton>
            </td>
          )
        },
        details: (item) => {
          return (
            <CCollapse visible={details.includes(item.id)}>
              <CCardBody>
                <h4>{item.pseudo}</h4>
                <p className="text-body-secondary">Email: {item.email}</p>
                <p className="text-body-secondary">Téléphone: {item.tel}</p>
                <p className="text-body-secondary">Matricule: {item.matricule}</p>
                <p className="text-body-secondary">Type: {item.type}</p>
                {item.details && (
                  <>
                    <p className="text-body-secondary">Niveau: {item.details.niveau}</p>
                    {item.details.carte_etudiant && (
                      <p className="text-body-secondary">Carte Étudiant: <a href={item.details.carte_etudiant}>Voir</a></p>
                    )}
                  </>
                )}
                <CButton size="sm" color="info">
                  User Settings
                </CButton>
                <CButton size="sm" color="danger" className="ml-1">
                  Delete
                </CButton>
              </CCardBody>
            </CCollapse>
          )
        },
      }}
    />
  )
}

export default SmartTableBasicExample
