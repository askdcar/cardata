"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function CarManagementFull() {
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});

  const [viewCar, setViewCar] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const initialState = {
    name: "",
    fuelType: "Petrol",
    isUpcoming: false,
    isPopular: false,
    isLatest: false,
    isElectric: false,
    country: "",
    description: "",
    category: "SUV",
    brandId: "",
    image: null,
    engineSpec: { type:"", displacement:"", cylinders:"", valvesPerCylinder:"", turbo:false, maxPower:"", maxTorque:"", gearbox:"", driveType:"" },
    fuelPerformance: { mileage:"", fuelTankCapacity:"", emissionNorm:"", topSpeed:"" },
    suspensionSteering: { frontSuspension:"", rearSuspension:"", steeringType:"", steeringColumn:"", turningRadius:"", frontBrake:"", rearBrake:"", alloyFront:"", alloyRear:"" },
    dimensionsCapacity: { length:"", width:"", height:"", bootSpace:"", seatingCapacity:"", wheelBase:"", kerbWeight:"", grossWeight:"", doors:"" },
    comfortConvenience: { powerSteering:false, airConditioner:false, automaticClimateControl:false, cruiseControl:false, keyLessEntry:false, engineStartStopButton:false, paddleShifters:false, rearACVents:false, parkingSensors:false, foldableRearSeat:"60:40", usbCharger:false },
    interiorFeatures: { tachometer:false, leatherWrappedSteeringWheel:false, dualToneDashboard:false, digitalCluster:false, upholstery:"Fabric" },
    exteriorFeatures: { alloyWheels:false, rearSpoiler:false, ledHeadlamps:false, ledTaillights:false, sharkFinAntenna:false, orvmPoweredFolding:false },
    safetyFeatures: { ABS:false, airbags:0, ESC:false, EBD:false, seatBeltWarning:false, ISOFIX:false, hillAssist:false, rearCamera:false, speedSensingAutoDoorLock:false },
    entertainment: { radio:"", bluetooth:false, touchscreen:false, touchscreenSize:"", androidAuto:"", appleCarPlay:"", speakers:0, tweeters:0, ARKAMYSPremiumSoundSystem:false },
    adasFeatures: { forwardCollisionWarning:false, automaticEmergencyBraking:false, laneDepartureWarning:false, laneKeepAssist:false, adaptiveCruiseControl:false, blindSpotCollisionAvoidanceAssist:false },
    internetFeatures: { liveLocation:false, remoteACOnOff:false, OTAUpdates:false, googleAlexaConnectivity:false, geoFenceAlert:false, SOS:false, valetMode:false, remoteDoorLockUnlock:false },
    variants: [],
  };

  const [formData, setFormData] = useState(initialState);

const toBool = (v) => v === true || v === "true" || v === 1 || v === "1";


const parseNested = (obj) => {
  if (!obj) return {}; // fallback if undefined
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      console.warn("Failed to parse nested JSON:", obj);
      return {}; // fallback if JSON is invalid
    }
  }
  return obj; // already object
};




  // Fetch cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/cars");
      setCars(Array.isArray(data) ? data : data.cars || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/brands");
      setBrands(Array.isArray(data) ? data : data.brands || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchBrands();
  }, []);



  const handleChange = (e, nestedKey = null) => {
  const { name, value, type, checked, files } = e.target;
  // guard: some libs might use a custom type string, so check attribute too
  const inputType = type || e.target.getAttribute("type");

  if (inputType === "checkbox" || inputType === "switch") {
    if (nestedKey) {
      setFormData(prev => ({
        ...prev,
        [nestedKey]: { ...prev[nestedKey], [name]: !!checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: !!checked }));
    }
  } else if (inputType === "file") {
    if (!nestedKey) setFormData(prev => ({ ...prev, [name]: files[0] }));
  } else {
    if (nestedKey) {
      setFormData(prev => ({ ...prev, [nestedKey]: { ...prev[nestedKey], [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }
};



  // Variants
  const addVariant = () => setFormData(prev => ({ ...prev, variants: [...prev.variants, { name:"", price:0, description:"", images:[] }] }));
  const removeVariant = index => {
    const updated = [...formData.variants]; updated.splice(index,1);
    setFormData(prev => ({ ...prev, variants: updated }));
  };
  const handleVariantChange = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, variants: updated }));
  };
  const handleVariantImageChange = (index, files) => {
    const updated = [...formData.variants];
    updated[index].images = Array.from(files);
    setFormData(prev => ({ ...prev, variants: updated }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Car name is required";
    if (!formData.brandId) newErrors.brandId = "Brand is required";
    if (!formData.fuelType.trim()) newErrors.fuelType = "Fuel Type is required";

    formData.variants.forEach((v, i) => {
      if (!v.name.trim()) newErrors[`variantName${i}`] = "Variant name is required";
      if (v.price === "" || isNaN(v.price)) newErrors[`variantPrice${i}`] = "Valid price is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const submitForm = async () => {
    if (!validateForm()) return;

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("fuelType", formData.fuelType);
      data.append("brandId", formData.brandId);
      data.append("description", formData.description);
      data.append("category", formData.category);
      if (formData.image) data.append("image", formData.image);

            // --- NEW: append booleans ---
      data.append("isUpcoming", formData.isUpcoming ? "true" : "false");
      data.append("isPopular", formData.isPopular ? "true" : "false");
      data.append("isLatest", formData.isLatest ? "true" : "false");
      data.append("isElectric", formData.isElectric ? "true" : "false");
      // ----------------------------


      // Nested objects
      const nestedKeys = [
        "engineSpec","fuelPerformance","suspensionSteering","dimensionsCapacity",
        "comfortConvenience","interiorFeatures","exteriorFeatures","safetyFeatures",
        "entertainment","adasFeatures","internetFeatures"
      ];
      nestedKeys.forEach(key => data.append(key, JSON.stringify(formData[key])));

      // Variants
      formData.variants.forEach((v, i) => {
        data.append(`variants[${i}][name]`, v.name);
        data.append(`variants[${i}][price]`, v.price);
        data.append(`variants[${i}][description]`, v.description);
        v.images.forEach(img => data.append(`variants[${i}][images]`, img));
      });

      if (isEdit && selectedCar) {
        await axios.put(`http://localhost:5000/api/cars/${selectedCar._id}`, data, { headers: { "Content-Type": "multipart/form-data" }});
      } else {
        await axios.post("http://localhost:5000/api/cars", data, { headers: { "Content-Type": "multipart/form-data" }});
      }

      setShowModal(false);
      fetchCars();
      setErrors({});
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Delete car
  const handleDelete = async id => {
    if (!confirm("Are you sure to delete this car?")) return;
    try { await axios.delete(`http://localhost:5000/api/cars/${id}`); fetchCars(); }
    catch(err){ console.error(err); }
  };

  // Edit modal
  const openEdit = car => {
    setSelectedCar(car);
    setFormData({
      ...initialState,
      ...car,
      brandId: car.brand?._id || car.brandId || "",
      image: null,
      // normalize top-level booleans
    isUpcoming: toBool(car.isUpcoming),
    isPopular: toBool(car.isPopular),
    isLatest: toBool(car.isLatest),
    isElectric: toBool(car.isElectric),
      engineSpec: { ...initialState.engineSpec, ...(typeof car.engineSpec==="string"?JSON.parse(car.engineSpec):car.engineSpec||{}) },
      fuelPerformance: { ...initialState.fuelPerformance, ...(typeof car.fuelPerformance==="string"?JSON.parse(car.fuelPerformance):car.fuelPerformance||{}) },
      suspensionSteering: { ...initialState.suspensionSteering, ...(typeof car.suspensionSteering==="string"?JSON.parse(car.suspensionSteering):car.suspensionSteering||{}) },
      dimensionsCapacity: { ...initialState.dimensionsCapacity, ...(typeof car.dimensionsCapacity==="string"?JSON.parse(car.dimensionsCapacity):car.dimensionsCapacity||{}) },
      comfortConvenience: { ...initialState.comfortConvenience, ...(typeof car.comfortConvenience==="string"?JSON.parse(car.comfortConvenience):car.comfortConvenience||{}) },
      interiorFeatures: { ...initialState.interiorFeatures, ...(typeof car.interiorFeatures==="string"?JSON.parse(car.interiorFeatures):car.interiorFeatures||{}) },
      exteriorFeatures: { ...initialState.exteriorFeatures, ...(typeof car.exteriorFeatures==="string"?JSON.parse(car.exteriorFeatures):car.exteriorFeatures||{}) },
      safetyFeatures: { ...initialState.safetyFeatures, ...(typeof car.safetyFeatures==="string"?JSON.parse(car.safetyFeatures):car.safetyFeatures||{}) },
      entertainment: { ...initialState.entertainment, ...(typeof car.entertainment==="string"?JSON.parse(car.entertainment):car.entertainment||{}) },
      adasFeatures: { ...initialState.adasFeatures, ...(typeof car.adasFeatures==="string"?JSON.parse(car.adasFeatures):car.adasFeatures||{}) },
      internetFeatures: { ...initialState.internetFeatures, ...(typeof car.internetFeatures==="string"?JSON.parse(car.internetFeatures):car.internetFeatures||{}) },
      variants: car.variants || [],
    });
    setIsEdit(true);
    setShowModal(true);
  };

  // View modal
  const openView = car => {
    setViewCar(car);
    setShowViewModal(true);
  };

  const renderNestedFields = (sectionKey, sectionData) => (
    <>
      <h6 className="mt-3">{sectionKey}</h6>
      <Row>
        {Object.keys(sectionData).map(key => (
          <Col md={3} key={key}>
            {typeof sectionData[key] === "boolean" ? (
              <Form.Check type="checkbox" name={key} label={key} checked={sectionData[key]} onChange={(e)=>handleChange(e, sectionKey)} />
            ) : (
              <Form.Group className="mb-2">
                <Form.Label>{key}</Form.Label>
                <Form.Control type={typeof sectionData[key]==="number"?"number":"text"} name={key} value={sectionData[key]||""} onChange={(e)=>handleChange(e, sectionKey)} />
              </Form.Group>
            )}
          </Col>
        ))}
      </Row>
    </>
  );

  const renderNestedView = (title, data) => (
    <div className="mb-3">
      <h6>{title}</h6>
      <Row>
        {Object.keys(data).map(key => (
          <Col md={3} key={key}>
            <strong>{key}:</strong> {typeof data[key]==="boolean"?(data[key]?"Yes":"No"):data[key]}
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <div className="container mt-4">
      <h3>Car Management</h3>
      <Button className="mb-3" onClick={()=>{setShowModal(true); setIsEdit(false); setFormData(initialState); setErrors({});}}>Add Car</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Fuel Type</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.length>0 ? cars.map(car => (
            <tr key={car._id}>
              <td>{car.name}</td>
              <td>{car.brand?.name || car.brandName}</td>
              <td>{car.fuelType}</td>
              <td>{car.category} {console.log(car)}</td>
              <td>
                <Button variant="info" size="sm" onClick={()=>openView(car)}>View</Button>{" "}
                <Button variant="warning" size="sm" onClick={()=>openEdit(car)}>Edit</Button>{" "}
                <Button variant="danger" size="sm" onClick={()=>handleDelete(car._id)}>Delete</Button>
              </td>
            </tr>
          )) : <tr><td colSpan={5}>No cars found</td></tr>}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={()=>setShowModal(false)} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Car" : "Add Car"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name}/>
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-2">
                  <Form.Label>Brand</Form.Label>
                  <Form.Select name="brandId" value={formData.brandId||""} onChange={handleChange} isInvalid={!!errors.brandId}>
                    <option value="">Select Brand</option>
                    {brands.map(b=>(<option key={b._id} value={b._id}>{b.name}</option>))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.brandId}</Form.Control.Feedback>
                </Form.Group>
              </Col>

  <Col md={5}>
    <Form.Group className="mb-2">
      <Form.Label>Category</Form.Label>
      <Form.Control
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
      />
    </Form.Group>
  </Col>


              <Col md={5}>
                <Form.Group className="mb-2">
                  <Form.Label>Fuel Type</Form.Label>
                  <Form.Control type="text" name="fuelType" value={formData.fuelType} onChange={handleChange} isInvalid={!!errors.fuelType}/>
                  <Form.Control.Feedback type="invalid">{errors.fuelType}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Main Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleChange}/>
            </Form.Group>



<Row className="mb-3">
  <Col md={3}>
    <Form.Check
      type="switch"
      label="Upcoming"
      name="isUpcoming"
      checked={formData.isUpcoming}
      onChange={handleChange}
    />
  </Col>
  <Col md={3}>
    <Form.Check
      type="switch"
      label="Popular"
      name="isPopular"
      checked={formData.isPopular}
      onChange={handleChange}
    />
  </Col>
  <Col md={3}>
    <Form.Check
      type="switch"
      label="Latest"
      name="isLatest"
      checked={formData.isLatest}
      onChange={handleChange}
    />
  </Col>
  <Col md={3}>
    <Form.Check
      type="switch"
      label="Electric"
      name="isElectric"
      checked={formData.isElectric}
      onChange={handleChange}
    />
  </Col>
</Row>


            {renderNestedFields("engineSpec", formData.engineSpec)}
            {renderNestedFields("fuelPerformance", formData.fuelPerformance)}
            {renderNestedFields("suspensionSteering", formData.suspensionSteering)}
            {renderNestedFields("dimensionsCapacity", formData.dimensionsCapacity)}
            {renderNestedFields("comfortConvenience", formData.comfortConvenience)}
            {renderNestedFields("interiorFeatures", formData.interiorFeatures)}
            {renderNestedFields("exteriorFeatures", formData.exteriorFeatures)}
            {renderNestedFields("safetyFeatures", formData.safetyFeatures)}
            {renderNestedFields("entertainment", formData.entertainment)}
            {renderNestedFields("adasFeatures", formData.adasFeatures)}
            {renderNestedFields("internetFeatures", formData.internetFeatures)}

            <h5 className="mt-3">Variants</h5>
            {formData.variants.map((v,i)=>(
              <div key={i} className="border p-2 mb-2">
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-2">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" value={v.name} onChange={e=>handleVariantChange(i,"name",e.target.value)} isInvalid={!!errors[`variantName${i}`]}/>
                      <Form.Control.Feedback type="invalid">{errors[`variantName${i}`]}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-2">
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" value={v.price} onChange={e=>handleVariantChange(i,"price",e.target.value)} isInvalid={!!errors[`variantPrice${i}`]}/>
                      <Form.Control.Feedback type="invalid">{errors[`variantPrice${i}`]}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-2">
                      <Form.Label>Description</Form.Label>
                      <Form.Control type="text" value={v.description} onChange={e=>handleVariantChange(i,"description",e.target.value)}/>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-2">
                      <Form.Label>Images</Form.Label>
                      <Form.Control type="file" multiple onChange={e=>handleVariantImageChange(i,e.target.files)}/>
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="danger" size="sm" onClick={()=>removeVariant(i)}>Remove Variant</Button>
              </div>
            ))}
            <Button variant="success" onClick={addVariant}>Add Variant</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={submitForm}>{isEdit ? "Update Car" : "Add Car"}</Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={()=>setShowViewModal(false)} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>View Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewCar && (
  <>
    <h5>{viewCar.name}</h5>
    <p><strong>Brand:</strong> {viewCar.brand?.name || viewCar.brandName}</p>
    <p><strong>Fuel Type:</strong> {viewCar.fuelType}</p>
    <p><strong>Category:</strong> {viewCar.category}</p>
    <p><strong>Description:</strong> {viewCar.description}</p>
    {viewCar.image && <img src={`http://localhost:5000${viewCar.image}`} alt={viewCar.name} className="img-fluid mb-3"/>}

<Row className="mb-3">
  <Col md={3}><strong>Upcoming:</strong> {viewCar.isUpcoming ? "Yes" : "No"}</Col>
  <Col md={3}><strong>Popular:</strong> {viewCar.isPopular ? "Yes" : "No"}</Col>
  <Col md={3}><strong>Latest:</strong> {viewCar.isLatest ? "Yes" : "No"}</Col>
  <Col md={3}><strong>Electric:</strong> {viewCar.isElectric ? "Yes" : "No"}</Col>
</Row>


    {/* {renderNestedView("Engine Specs", parseNested(viewCar.engineSpec))}
    {renderNestedView("Fuel Performance", parseNested(viewCar.fuelPerformance))}
    {renderNestedView("Suspension & Steering", parseNested(viewCar.suspensionSteering))}
    {renderNestedView("Dimensions & Capacity", parseNested(viewCar.dimensionsCapacity))}
    {renderNestedView("Comfort & Convenience", parseNested(viewCar.comfortConvenience))}
    {renderNestedView("Interior Features", parseNested(viewCar.interiorFeatures))}
    {renderNestedView("Exterior Features", parseNested(viewCar.exteriorFeatures))}
    {renderNestedView("Safety Features", parseNested(viewCar.safetyFeatures))}
    {renderNestedView("Entertainment", parseNested(viewCar.entertainment))}
    {renderNestedView("ADAS Features", parseNested(viewCar.adasFeatures))}
    {renderNestedView("Internet Features", parseNested(viewCar.internetFeatures))} */}

{renderNestedView("Engine Specs", parseNested(viewCar.specs?.engine))}
{renderNestedView("Fuel Performance", parseNested(viewCar.specs?.fuelPerformance))}
{renderNestedView("Suspension & Steering", parseNested(viewCar.specs?.suspensionSteering))}
{renderNestedView("Dimensions & Capacity", parseNested(viewCar.specs?.dimensionsCapacity))}
{renderNestedView("Comfort & Convenience", parseNested(viewCar.specs?.comfortConvenience))}
{renderNestedView("Interior Features", parseNested(viewCar.specs?.interiorFeatures))}
{renderNestedView("Exterior Features", parseNested(viewCar.specs?.exteriorFeatures))}
{renderNestedView("Safety Features", parseNested(viewCar.specs?.safetyFeatures))}
{renderNestedView("Entertainment", parseNested(viewCar.specs?.entertainment))}
{renderNestedView("ADAS Features", parseNested(viewCar.specs?.adasFeatures))}
{renderNestedView("Internet Features", parseNested(viewCar.specs?.internetFeatures))}



    <h5>Variants</h5>
    {viewCar.variants?.map((v,i)=>(
      <div key={i} className="border p-2 mb-2">
        <p><strong>Name:</strong> {v.name}</p>
        <p><strong>Price:</strong> {v.price}</p>
        <p><strong>Description:</strong> {v.description}</p>
        {/* {v.images?.map((img,idx)=>(
          <img key={idx} src={`http://localhost:5000${img}`} alt={`Variant ${v.name}`} style={{width:"100px", marginRight:"5px"}} />
        ))} */}
      </div>
    ))}
  </>
)}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

