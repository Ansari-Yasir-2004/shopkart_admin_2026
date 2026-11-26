import {
  Row,
  Col,
} from "react-bootstrap";
import "../../assets/style/dashboard.css"

const Dashboard = () => {
  const stats = [
    {
      title: "Total active users",
      value: "18,765",
      change: "+2.6%",
      positive: true,
    },
    {
      title: "Total installed",
      value: "4,876",
      change: "+0.2%",
      positive: true,
    },
    {
      title: "Total downloads",
      value: "678",
      change: "-0.1%",
      positive: false,
    },
  ];

  return (
    <div className="dashboard-root">

      {/* Welcome */}
      <div className="welcome-card">
        <div>
          <h3>Welcome back 👋</h3>
          <h2>Jaydon Frankie</h2>
          <p>
            If you are going to use a passage of Lorem Ipsum, you need to be sure
            there isn't anything.
          </p>

          <button className="primary-btn">Go now</button>
        </div>
      </div>

      {/* Stats */}
      <Row>
        {stats.map((item, i) => (
          <Col sm={12} md={6} lg={4} key={i}>
            <div className="stats-card">

              <div className="stats-info">
                <div className="stats-title">{item.title}</div>

                <div className="stats-value">{item.value}</div>

                <div
                  className={`stats-change ${item.positive ? "up" : "down"
                    }`}
                >
                  {item.change} last 7 days
                </div>
              </div>

              {/* Fake chart bars */}
              <div className="mini-chart">
                <span></span><span></span><span></span>
                <span></span><span></span>
              </div>

            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;