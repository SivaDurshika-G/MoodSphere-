import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function MoodPieChart({ data }) {
  const moodCounts = data.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood,
    value: count,
  }));

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff6666'];

  return (
    <PieChart width={300} height={250}>
      <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
        {chartData.map((_, i) => (
          <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
