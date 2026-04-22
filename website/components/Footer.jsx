export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-200 py-6 text-center">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} Augietech. All rights reserved.
      </p>
    </footer>
  )
}