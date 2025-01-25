interface Parent {
  name: string
}

interface Child {
  name: string
}

export function childName(parent: Parent, child: Child): string {
  return `${parent.name} (${child.name})`
}