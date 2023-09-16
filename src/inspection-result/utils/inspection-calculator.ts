import { InspectionResultDetailDto } from '../dto/Inspection-result-detail.Dto';
import { InspectionResultStatusEnum } from '../interface/inspection-result-status-enum';
export const inspectionCalculator = (
  details: InspectionResultDetailDto[] = [],
) => {
  const inspectionQualification = details.reduce(
    (prev, act) => prev + act.point,
    0,
  );

  return {
    qualification: inspectionQualification,
    status: getStatusInspectionByQualification(inspectionQualification),
  };
};

const getStatusInspectionByQualification = (qualification = 0) => {
  if (qualification <= 0 || qualification <= 40) {
    return InspectionResultStatusEnum.RECHECK;
  }

  return InspectionResultStatusEnum.SAFE;
};
