import "./simpleSteps.css";

const SimpleSteps = ({ stepDets }) => {
  return (
    <div
      className="simpleSteps_wrapper"
      style={{ backgroundColor: stepDets?.bgColor }}
    >
      <div className="stepCounter_container">
        <p>{stepDets?.index}</p>
      </div>
      <div className="description_container">
        <h3 className="steps_title">{stepDets?.title}</h3>
        <p className="steps_description">{stepDets?.description}</p>
      </div>
      <div className="steps_image_container">
        <img
          src={`/images/${stepDets?.asociatedImg}`}
          alt="steps to join HomeMade"
          className={`${stepDets?.index == 1 && 'steps_one_asociatedImg'} ${stepDets?.index == 2 && 'steps_two_asociatedImg'} ${stepDets?.index == 3 && 'steps_three_asociatedImg'}`}
        />
        <img
          src={`/images/${stepDets?.blob}`}
          alt="Blob"
          className="steps_blob"
        />
      </div>
    </div>
  );
};

export default SimpleSteps;
