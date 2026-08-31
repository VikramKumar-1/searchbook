export const APP_CONFIG = {
  name: 'SearchBook',
  description: 'Hyperlocal city marketplace',
  supportedCities: [
    { id: 'ranchi', name: 'Ranchi' },
    { id: 'delhi', name: 'Delhi' },
    { id: 'delhi-ncr', name: 'Delhi NCR' },
    { id: 'gurugram', name: 'Gurugram' },
    { id: 'noida', name: 'Noida' },
    { id: 'chandigarh', name: 'Chandigarh' }
  ],
  limits: {
    freeListings: 5,
    maxPhotosPerListing: 10,
  }
};
