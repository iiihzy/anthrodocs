export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-4xl font-bold mb-4">404 - 页面未找到</h1>
      <p className="text-gray-600 mb-8">抱歉，您访问的页面不存在。</p>
      <a href="/" className="text-blue-600 hover:underline">
        返回首页
      </a>
    </div>
  );
}
