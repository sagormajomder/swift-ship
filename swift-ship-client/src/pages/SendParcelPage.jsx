import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import MyContainer from '../components/MyContainer';

export default function SendParcelPage() {
  const warehousesData = useLoaderData();
  // console.log(warehousesData);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const senderRegion = useWatch({ control, name: 'senderRegion' });
  const receiverRegion = useWatch({ control, name: 'receiverRegion' });
  const senderDistrict = useWatch({ control, name: 'senderDistrict' });
  const receiverDistrict = useWatch({ control, name: 'receiverDistrict' });

  function handleAddParcel(data) {
    console.log(data);

    const isDocument = data.parcelType === 'document';
    const isSameDistrict = data.senderDistrict === data.receiverDistrict;
    const parcelWeight = parseFloat(data.parcelWeight);

    let cost = 0;

    if (isDocument) {
      cost = isSameDistrict ? 60 : 80;
    } else {
      if (parcelWeight < 3) {
        cost = isSameDistrict ? 110 : 150;
      } else {
        const minCharge = isSameDistrict ? 110 : 150;
        const extraWeight = parcelWeight - 3;
        const extraCharge = isSameDistrict
          ? extraWeight * 40
          : extraWeight * 40 + 40;

        cost = minCharge + extraCharge;
      }
    }

    // console.log('cost', cost);

    Swal.fire({
      title: 'Agree with the Cost?',
      text: `You will be charged ${cost} taka!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'I agree!',
    }).then(result => {
      if (result.isConfirmed) {
        // save the parcel info to the database
        // axiosSecure.post('/parcels', data)
        //     .then(res => {
        //         console.log('after saving parcel', res.data);
        //     })
        // Swal.fire({
        //     title: "Deleted!",
        //     text: "Your file has been deleted.",
        //     icon: "success"
        // });
      }
    });
  }

  const regions = [...new Set(warehousesData.map(w => w.region))];

  function districtsByRegion(region) {
    const senderRegionObjs = warehousesData.filter(w => w.region === region);
    return senderRegionObjs.map(w => w.district);
  }

  function warehousesByDistrict(district) {
    return warehousesData.find(w => w.district === district)?.covered_area;
  }

  return (
    <section className='py-10'>
      <MyContainer>
        <div className='bg-white p-10 rounded-2xl'>
          <h1 className='heading-primary text-4xl text-secondary'>
            Add Parcel
          </h1>
          <div className='divider'></div>
          <form className='space-y-4' onSubmit={handleSubmit(handleAddParcel)}>
            <h2 className='heading-secondary text-2xl'>
              Enter your parcel details
            </h2>

            {/* Parcel Type */}
            <div className='flex gap-4'>
              <label className='label'>
                <input
                  type='radio'
                  value='document'
                  className='radio radio-success'
                  defaultChecked
                  {...register('percelType', { required: true })}
                />
                Document
              </label>
              <label className='label'>
                <input
                  type='radio'
                  value='non-document'
                  className='radio radio-success'
                  {...register('percelType', { required: true })}
                />
                Non-Document
              </label>
            </div>

            {/* Percel Info: name , wight */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center'>
              <fieldset className='fieldset'>
                <label htmlFor='parcel-name' className='label'>
                  Parcel Name
                </label>
                <input
                  type='text'
                  id='parcel-name'
                  className='input w-full'
                  placeholder='Parcel Name'
                  {...register('parcelName', { required: true })}
                />
              </fieldset>
              <fieldset className='fieldset'>
                <label htmlFor='parcel-weight' className='label'>
                  Parcel Weight(KG)
                </label>
                <input
                  type='number'
                  id='parcel-weight'
                  className='input w-full'
                  placeholder='Parcel Weight (KG)'
                  {...register('parcelWeight', { required: true })}
                />
              </fieldset>
            </div>

            <div className='divider'></div>

            {/* Two column */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
              {/* Sender Details */}
              <div className='space-y-2'>
                <h4 className='heading-quaternary'>Sender Details</h4>

                <fieldset className='fieldset'>
                  {/* Sender Name */}
                  <label htmlFor='sender-name' className='label'>
                    Sender Name
                  </label>
                  <input
                    type='text'
                    id='sender-name'
                    className='input w-full'
                    placeholder='Sender Name'
                    {...register('senderName', { required: true })}
                  />

                  {/* sender email */}
                  <label htmlFor='sender-email' className='label'>
                    Sender Email
                  </label>
                  <input
                    type='text'
                    id='sender-email'
                    {...register('senderEmail')}
                    className='input w-full'
                    placeholder='Sender Email'
                  />

                  {/* Sender Region and District */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-2 items-center'>
                    {/* Sender Region */}
                    <fieldset className='fieldset'>
                      <label htmlFor='sender-region' className='label'>
                        Sender Region
                      </label>
                      <select
                        id='sender-region'
                        defaultValue='Pick a region'
                        className='select w-full '
                        {...register('senderRegion', { required: true })}>
                        <option value='Pick a region' disabled={true}>
                          Pick a Region
                        </option>
                        {regions.map((region, i) => (
                          <option key={i} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </fieldset>

                    {/* Sender District */}
                    <fieldset className='fieldset'>
                      <label htmlFor='sender-district' className='label'>
                        Sender District
                      </label>
                      <select
                        id='sender-district'
                        defaultValue='Pick a destrict'
                        className='select w-full '
                        {...register('senderDistrict', { required: true })}>
                        <option value='Pick a destrict' disabled={true}>
                          Pick a Destrict
                        </option>
                        {districtsByRegion(senderRegion).map((district, i) => (
                          <option key={i} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </fieldset>
                  </div>

                  {/* Sender Address */}
                  <label htmlFor='sender-address' className='label'>
                    Sender Address
                  </label>
                  <input
                    type='text'
                    id='sender-address'
                    className='input w-full'
                    placeholder='Sender Address'
                    {...register('senderAddress', { required: true })}
                  />

                  {/* Sender  Contact and Pickup */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-2 items-center'>
                    {/* Sender Contact */}
                    <fieldset className='fieldset'>
                      <label htmlFor='sender-contact' className='label'>
                        Sender Contact No
                      </label>
                      <input
                        type='text'
                        id='sender-contact'
                        className='input w-full'
                        placeholder='Sender Contact No'
                        {...register('senderContact', { required: true })}
                      />
                    </fieldset>
                    {/* Sender pickup */}
                    <fieldset className='fieldset'>
                      <label htmlFor='sender-pickup' className='label'>
                        Sender Pickup Ware house
                      </label>
                      <select
                        id='sender-pickup'
                        className='select w-full'
                        defaultValue=''
                        {...register('senderWarehouse', {
                          required: true,
                        })}>
                        <option value='' disabled={true}>
                          Select Ware house
                        </option>

                        {warehousesByDistrict(senderDistrict)?.map(
                          (warehouse, i) => (
                            <option key={i} value={warehouse}>
                              {warehouse}
                            </option>
                          )
                        )}
                      </select>
                    </fieldset>
                  </div>

                  {/* Pickup Intructions */}
                  <label htmlFor='pickup-intructions' className='label'>
                    Pickup Intructions
                  </label>
                  <textarea
                    id='pickup-intructions'
                    className='textarea w-full'
                    placeholder='Pickup Intruction'
                    {...register('pickupIntructions')}></textarea>
                </fieldset>
              </div>
              {/* Reciver Details */}
              <div className='space-y-2'>
                <h4 className='heading-quaternary'>Receiver Details</h4>
                <fieldset className='fieldset'>
                  {/* Receiver Name*/}

                  <label htmlFor='receiver-name' className='label'>
                    Receiver Name
                  </label>
                  <input
                    type='text'
                    id='receiver-name'
                    className='input w-full'
                    placeholder='Reciver Name'
                    {...register('reciverName', { required: true })}
                  />

                  {/* receiver email */}
                  <label htmlFor='receiver-email' className='label'>
                    Receiver Email
                  </label>
                  <input
                    id='receiver-email'
                    type='text'
                    {...register('receiverEmail')}
                    className='input w-full'
                    placeholder='Receiver Email'
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-2 items-center'>
                    {/* Receiver Region */}
                    <fieldset className='fieldset'>
                      <label htmlFor='receiver-region' className='label'>
                        Receiver Region
                      </label>
                      <select
                        id='receiver-region'
                        defaultValue=''
                        className='select w-full'
                        {...register('receiverRegion', { required: true })}>
                        <option value='' disabled={true}>
                          Pick a Region
                        </option>
                        {regions.map((region, i) => (
                          <option key={i} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </fieldset>

                    {/* Receiver District */}
                    <fieldset className='fieldset'>
                      <label htmlFor='receiver-district' className='label'>
                        Receiver District
                      </label>
                      <select
                        id='receiver-district'
                        defaultValue=''
                        className='select w-full'
                        {...register('receiverDistrict', { required: true })}>
                        <option value='' disabled={true}>
                          Pick a Destrict
                        </option>
                        {districtsByRegion(receiverRegion).map(
                          (district, i) => (
                            <option key={i} value={district}>
                              {district}
                            </option>
                          )
                        )}
                      </select>
                    </fieldset>
                  </div>

                  {/* Receiver Address */}
                  <label htmlFor='receiver-address' className='label'>
                    Receiver Address
                  </label>
                  <input
                    type='text'
                    id='receiver-address'
                    className='input w-full'
                    placeholder='Receiver Address'
                    {...register('receiverAddress', { required: true })}
                  />

                  {/* Receiver Contact & Delivery warehouse */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-2 items-center'>
                    {/* Receiver Contact */}
                    <fieldset className='fieldset'>
                      <label htmlFor='receiver-contact' className='label'>
                        Receiver Contact No
                      </label>
                      <input
                        type='text'
                        id='receiver-contact'
                        className='input w-full'
                        placeholder='Receiver Contact No'
                        {...register('receiverContact', { required: true })}
                      />
                    </fieldset>

                    {/* Receiver Delivery warehouse */}
                    <fieldset className='fieldset'>
                      <label htmlFor='receiver-pickup' className='label'>
                        Receiver Delivery Ware house
                      </label>
                      <select
                        id='receiver-pickup'
                        className='select w-full'
                        defaultValue=''
                        {...register('receiverWarehouse', {
                          required: true,
                        })}>
                        <option value='' disabled={true}>
                          Select Ware house
                        </option>

                        {warehousesByDistrict(receiverDistrict)?.map(
                          (warehouse, i) => (
                            <option key={i} value={warehouse}>
                              {warehouse}
                            </option>
                          )
                        )}
                      </select>
                    </fieldset>
                  </div>

                  {/* Delivery Intruction */}
                  <label htmlFor='delivery-intructions' className='label'>
                    Delivery Intruction
                  </label>
                  <textarea
                    id='delivery-intructions'
                    className='textarea w-full'
                    placeholder='Delivery Intruction'
                    {...register('deliveryIntructions')}></textarea>
                </fieldset>
              </div>
            </div>

            {/* Submit Button */}
            <button type='submit' className='btn btn-primary text-neutral'>
              Send Parcel
            </button>
          </form>
        </div>
      </MyContainer>
    </section>
  );
}
