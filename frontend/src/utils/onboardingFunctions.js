export function validateStepTwo(chefInfo, validateOnboardStepTwo, setFormErr, setOnboardStep) {
  if (!validateOnboardStepTwo.current) return;

  validateOnboardStepTwo.current.triggerSubmit(); // triggers the submit button

  // validate submitted info here
  if (
    !chefInfo?.name ||
    !chefInfo?.location ||
    !chefInfo?.rates ||
    !chefInfo?.languages
  ) {
    setFormErr("complete the form")
    return
  }

  if(
    !chefInfo?.position.latitude ||
    !chefInfo?.position.longitude
    ) {
        setFormErr("Provide your position for faster match with clients")
        return
    }

  //  validate if the city and country exists
  // validate if the languages exists
  
  setFormErr('')

  setOnboardStep(prev => prev == 3 ? 3 : prev + 1)
}

export function validateStepThree(chefInfo, chefPicture, setFormErr, setUpProfile) {
  if (!chefPicture) {
    setFormErr("Add your picture")
    return
  }
  else if(!chefInfo?.profileOverview) {
    setFormErr("Tell us about yourself")
    return
  }

  // validation pass
  setFormErr('')
  setUpProfile()
}


export function validateClientOnboardForm(clientInfo, setFormErr) {
  if (
    !clientInfo?.clientName ||
    !clientInfo?.location
  ) {
    setFormErr("complete the form")
    return false
  }

  if(
    !clientInfo?.position.latitude ||
    !clientInfo?.position.longitude
    ) {
        setFormErr("Provide your position for faster match with clients")
        return false
    }

    return true
}