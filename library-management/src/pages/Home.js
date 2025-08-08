import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";
import CategoryIcon from "@mui/icons-material/Category";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BarChartIcon from "@mui/icons-material/BarChart";
import Search from "../components/SearchGoogle";
import GroupIcon from "@mui/icons-material/Group";
const Home = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Quản lý Sách",
      path: "/books",
      icon: <BookIcon fontSize="large" color="primary" />,
    },
    {
      title: "Quản lý Danh mục",
      path: "/categories",
      icon: <CategoryIcon fontSize="large" color="secondary" />,
    },
        {
      title: "Quản lý Thành viên",
      path: "/members",
      icon: <GroupIcon fontSize="large" color="ff9800" />,
    },
    {
      title: "Quản lý Mượn/Trả sách",
      path: "/borrows",
      icon: <SwapHorizIcon fontSize="large" sx={{ color: "#6d4dadff" }} />,
    },
    {
      title: "Thống kê",
      path: "/stats",
      icon: <BarChartIcon fontSize="large" sx={{ color: "#4caf50" }} />,
    },
  ];

  return (
    <>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Hệ thống Quản lý Thư viện
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
          }}
        >
          {sections.map((section) => (
            <Card
              key={section.title}
              onClick={() => navigate(section.path)}
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                borderRadius: 3,
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.03)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 4,
                }}
              >
                {section.icon}
                <Typography variant="h6" mt={2} textAlign="center">
                  {section.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
      <Search/>
    </>
  );
};

export default Home;
