import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';


const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: '#2b2b2b',
    border: "1px solid #d2d9ee",
    fontSize: "0.75rem",
    fontFamily: "Lato",
    maxWidth: "14rem"
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#d2d9ee",
  },
}));

export { CustomTooltip as Tooltip }
