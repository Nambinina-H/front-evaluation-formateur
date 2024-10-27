import React, { useState, useEffect } from 'react'
import { CBadge, CButton, CCardBody, CCollapse, CSmartTable, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react-pro'
import { getData, deleteData } from '../../services/apiService' // Import the getData and deleteData functions
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'

const SmartTableBasicExample = () => {
  const [details, setDetails] = useState([])
  const [data, setData] = useState([]) // State to store fetched data
  const [currentItems, setCurrentItems] = useState([]) // State to store current items for CSV export
  const [visible, setVisible] = useState(false) // State to manage modal visibility
  const [userIdToDelete, setUserIdToDelete] = useState(null) // State to store the user ID to be deleted

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData('utilisateur/utilisateurs/')
        setData(response)
        setCurrentItems(response)
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
      _style: { width: '15%' },
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

  const handleCreateUser = () => {
    // Logic to handle user creation
    console.log('Create User button clicked')
  }

  const handleDeleteUser = (id) => {
    setUserIdToDelete(id)
    setVisible(true)
  }

  const confirmDeleteUser = async () => {
    try {
      await deleteData(`utilisateur/utilisateurs/delete/${userIdToDelete}/`)
      setData(data.filter(user => user.id !== userIdToDelete))
      setCurrentItems(currentItems.filter(user => user.id !== userIdToDelete))
      console.log('Delete User button clicked for user id:', userIdToDelete)
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      setVisible(false)
      setUserIdToDelete(null)
    }
  }

  const csvContent = currentItems.map((item) => Object.values(item).join(',')).join('\n')
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent)

  return (
    <>
      <CButton color="primary" onClick={handleCreateUser} className="mb-3">
        Créer Utilisateur
      </CButton>
      <CButton
        color="primary"
        className="mb-3"
        href={csvCode}
        download="coreui-table-data.csv"
        target="_blank"
      >
        Download current items (.csv)
      </CButton>
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
        onFilteredItemsChange={setCurrentItems} // Update current items for CSV export
        scopedColumns={{
          is_active: (item) => (
            <td>
              <CBadge color={getBadge(item.is_active)}>{item.is_active ? 'Active' : 'Inactive'}</CBadge>
            </td>
          ),
          show_details: (item) => {
            return (
              <td className="py-2">
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100px' }}>
              <CButton
              color="primary"
              variant="outline"
              shape="square"
              size="sm"
              onClick={() => {
                toggleDetails(item.id)
              }}
              style={{ flex: 1, marginRight: '5px' }}
              >
              {details.includes(item.id) ? 'Hide' : 'Show'}
              </CButton>
              <CButton
              size="sm"
              color="danger"
              onClick={() => handleDeleteUser(item.id)}
              style={{ flex: 1 }}
              >
              <CIcon icon={cilTrash} customClassName="nav-icon" style={{ color: 'white' }} />
              </CButton>
              </div>
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
                </CCardBody>
              </CCollapse>
            )
          },
        }}
      />
      <CModal
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample" className="w-100 text-center">Confirmation de suppression</CModalTitle>
        </CModalHeader>
        <CModalBody className="w-100 text-center">
          Êtes-vous sûr de vouloir supprimer cet utilisateur ?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Annuler
          </CButton>
          <CButton color="danger" onClick={confirmDeleteUser}>
            Supprimer
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default SmartTableBasicExample
