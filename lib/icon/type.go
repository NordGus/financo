package icon

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
)

type Type string

// UnmarshalJSON receives a buffer b, and ensures that the provided value is a
// valid [Type]. So [Type] satisfies the [json.Unmarshaler] interface.
//
// It returns an error if the buffer can't be unmarshal into an string or the
// provided value is not a supported [Type].
func (t *Type) UnmarshalJSON(b []byte) error {
	var (
		s   string
		err error
	)

	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	*t, err = stringToIcon(s)
	if err != nil {
		return err
	}

	return nil
}

func (t Type) MarshalJSON() ([]byte, error) {
	s, err := iconToString(t)
	if err != nil {
		return []byte{}, err
	}

	return json.Marshal(s)
}

// Scan takes the value returned by the SQL database and maps it to [Type].
// So [Type] satisfies the [sql.Scanner] interface.
//
// It returns an error if [Type] is an unsupported value.
func (t *Type) Scan(value any) error {
	var err error

	s, ok := value.(string)
	if !ok {
		return errors.New("icon: invalid column type")
	}

	*t, err = stringToIcon(s)
	if err != nil {
		return err
	}

	return nil
}

// Value returns the value of [Type] to be stored in the SQL database. So [Type]
// satisfies the [driver.Valuer] interface.
//
// It returns an error if [Type] is an unsupported value.
func (t Type) Value() (driver.Value, error) {
	return iconToString(t)
}

func stringToIcon(s string) (Type, error) {
	switch strings.ToLower(s) {
	default:
		return FireExtinguisher, fmt.Errorf("icon: invalid value \"%s\"", s)
	case "credit-card":
		return CreditCard, nil
	case "landmark":
		return Landmark, nil
	case "vault":
		return Vault, nil
	case "banknote":
		return Banknote, nil
	case "hand-coins":
		return HandCoins, nil
	case "piggy-bank":
		return PiggyBank, nil
	case "wallet-cards":
		return WalletCards, nil
	case "wallet-minimal":
		return WalletMinimal, nil
	case "car-front":
		return CarFront, nil
	case "car-taxi-front":
		return CarTaxiFront, nil
	case "ambulance":
		return Ambulance, nil
	case "cross":
		return Cross, nil
	case "hospital":
		return Hospital, nil
	case "bandage":
		return Bandage, nil
	case "heart-pulse":
		return HeartPulse, nil
	case "bone":
		return Bone, nil
	case "brain":
		return Brain, nil
	case "graduation-cap":
		return GraduationCap, nil
	case "dices":
		return Dices, nil
	case "school":
		return School, nil
	case "bitcoin":
		return Bitcoin, nil
	case "target":
		return Target, nil
	case "trophy":
		return Trophy, nil
	case "book":
		return Book, nil
	case "book-open":
		return BookOpen, nil
	case "bookmark":
		return Bookmark, nil
	case "notebook":
		return Notebook, nil
	case "ticket":
		return Ticket, nil
	case "tag":
		return Tag, nil
	case "tickets":
		return Tickets, nil
	case "fence":
		return Fence, nil
	case "train-front":
		return TrainFront, nil
	case "tv":
		return Tv, nil
	case "cigarette":
		return Cigarette, nil
	case "circle-parking":
		return CircleParking, nil
	case "container":
		return Container, nil
	case "fuel":
		return Fuel, nil
	case "luggage":
		return Luggage, nil
	case "plane":
		return Plane, nil
	case "ship":
		return Ship, nil
	case "briefcase":
		return Briefcase, nil
	case "clapperboard":
		return Clapperboard, nil
	case "film":
		return Film, nil
	case "popcorn":
		return Popcorn, nil
	case "dumbbell":
		return Dumbbell, nil
	case "biceps-flexed":
		return BicepsFlexed, nil
	case "mic-vocal":
		return MicVocal, nil
	case "piano":
		return Piano, nil
	case "headphones":
		return Headphones, nil
	case "computer":
		return Computer, nil
	case "binary":
		return Binary, nil
	case "cable":
		return Cable, nil
	case "cpu":
		return Cpu, nil
	case "laptop":
		return Laptop, nil
	case "pc-case":
		return PcCase, nil
	case "router":
		return Router, nil
	case "phone":
		return Phone, nil
	case "smartphone":
		return Smartphone, nil
	case "stethoscope":
		return Stethoscope, nil
	case "utility-pole":
		return UtilityPole, nil
	case "megaphone":
		return Megaphone, nil
	case "ethernet-port":
		return EthernetPort, nil
	case "earth":
		return Earth, nil
	case "globe":
		return Globe, nil
	case "shield":
		return Shield, nil
	case "volleyball":
		return Volleyball, nil
	case "ruler":
		return Ruler, nil
	case "calculator":
		return Calculator, nil
	case "music":
		return Music, nil
	case "drum":
		return Drum, nil
	case "theater":
		return Theater, nil
	case "shopping-bag":
		return ShoppingBag, nil
	case "shopping-basket":
		return ShoppingBasket, nil
	case "shopping-cart":
		return ShoppingCart, nil
	case "barcode":
		return Barcode, nil
	case "shirt":
		return Shirt, nil
	case "tent-tree":
		return TentTree, nil
	case "utensils":
		return Utensils, nil
	case "shower-head":
		return ShowerHead, nil
	case "washing-machine":
		return WashingMachine, nil
	case "bed-single":
		return BedSingle, nil
	case "bed-double":
		return BedDouble, nil
	case "bus-front":
		return BusFront, nil
	case "pill":
		return Pill, nil
	case "syringe":
		return Syringe, nil
	case "microscope":
		return Microscope, nil
	case "siren":
		return Siren, nil
	case "zap":
		return Zap, nil
	case "heater":
		return Heater, nil
	case "battery-charging":
		return BatteryCharging, nil
	case "user":
		return User, nil
	case "venetian-mask":
		return VenetianMask, nil
	case "house":
		return House, nil
	case "hammer":
		return Hammer, nil
	case "microwave":
		return Microwave, nil
	case "paint-roller":
		return PaintRoller, nil
	case "paintbrush-vertical":
		return PaintbrushVertical, nil
	case "tv-minimal-play":
		return TvMinimalPlay, nil
	case "wine":
		return Wine, nil
	case "medal":
		return Medal, nil
	case "crown":
		return Crown, nil
	case "milk":
		return Milk, nil
	case "glass-water":
		return GlassWater, nil
	case "droplet":
		return Droplet, nil
	case "hand-platter":
		return HandPlatter, nil
	case "fire-extinguisher":
		return FireExtinguisher, nil
	case "package":
		return Package, nil
	case "armchair":
		return Armchair, nil
	case "at-sign":
		return AtSign, nil
	case "cake":
		return Cake, nil
	case "building":
		return Building, nil
	case "cog":
		return Cog, nil
	case "id-card":
		return IdCard, nil
	case "mail":
		return Mail, nil
	case "search":
		return Search, nil
	case "binoculars":
		return Binoculars, nil
	case "tree-palm":
		return TreePalm, nil
	case "trees":
		return Trees, nil
	case "flower":
		return Flower, nil
	case "dog":
		return Dog, nil
	case "paw-print":
		return PawPrint, nil
	case "cat":
		return Cat, nil
	case "fish":
		return Fish, nil
	case "bird":
		return Bird, nil
	case "ice-cream-cone":
		return IceCreamCone, nil
	case "beef":
		return Beef, nil
	case "pizza":
		return Pizza, nil
	case "apple":
		return Apple, nil
	case "bean":
		return Bean, nil
	case "drumstick":
		return Drumstick, nil
	case "salad":
		return Salad, nil
	case "sandwich":
		return Sandwich, nil
	case "bike":
		return Bike, nil
	case "coins":
		return Coins, nil
	case "gamepad":
		return Gamepad, nil
	case "skull":
		return Skull, nil
	case "sword":
		return Sword, nil
	case "bell-electric":
		return BellElectric, nil
	case "heart":
		return Heart, nil
	case "clover":
		return Clover, nil
	case "monitor-play":
		return MonitorPlay, nil
	case "glasses":
		return Glasses, nil
	case "key-round":
		return KeyRound, nil
	case "candy":
		return Candy, nil
	case "baby":
		return Baby, nil
	}
}

func iconToString(t Type) (string, error) {
	switch t {
	default:
		return "", fmt.Errorf("icon: invalid value \"%s\"", string(t))
	case CreditCard:
		return "credit-card", nil
	case Landmark:
		return "landmark", nil
	case Vault:
		return "vault", nil
	case Banknote:
		return "banknote", nil
	case HandCoins:
		return "hand-coins", nil
	case PiggyBank:
		return "piggy-bank", nil
	case WalletCards:
		return "wallet-cards", nil
	case WalletMinimal:
		return "wallet-minimal", nil
	case CarFront:
		return "car-front", nil
	case CarTaxiFront:
		return "car-taxi-front", nil
	case Ambulance:
		return "ambulance", nil
	case Cross:
		return "cross", nil
	case Hospital:
		return "hospital", nil
	case Bandage:
		return "bandage", nil
	case HeartPulse:
		return "heart-pulse", nil
	case Bone:
		return "bone", nil
	case Brain:
		return "brain", nil
	case GraduationCap:
		return "graduation-cap", nil
	case Dices:
		return "dices", nil
	case School:
		return "school", nil
	case Bitcoin:
		return "bitcoin", nil
	case Target:
		return "target", nil
	case Trophy:
		return "trophy", nil
	case Book:
		return "book", nil
	case BookOpen:
		return "book-open", nil
	case Bookmark:
		return "bookmark", nil
	case Notebook:
		return "notebook", nil
	case Ticket:
		return "ticket", nil
	case Tag:
		return "tag", nil
	case Tickets:
		return "tickets", nil
	case Fence:
		return "fence", nil
	case TrainFront:
		return "train-front", nil
	case Tv:
		return "tv", nil
	case Cigarette:
		return "cigarette", nil
	case CircleParking:
		return "circle-parking", nil
	case Container:
		return "container", nil
	case Fuel:
		return "fuel", nil
	case Luggage:
		return "luggage", nil
	case Plane:
		return "plane", nil
	case Ship:
		return "ship", nil
	case Briefcase:
		return "briefcase", nil
	case Clapperboard:
		return "clapperboard", nil
	case Film:
		return "film", nil
	case Popcorn:
		return "popcorn", nil
	case Dumbbell:
		return "dumbbell", nil
	case BicepsFlexed:
		return "biceps-flexed", nil
	case MicVocal:
		return "mic-vocal", nil
	case Piano:
		return "piano", nil
	case Headphones:
		return "headphones", nil
	case Computer:
		return "computer", nil
	case Binary:
		return "binary", nil
	case Cable:
		return "cable", nil
	case Cpu:
		return "cpu", nil
	case Laptop:
		return "laptop", nil
	case PcCase:
		return "pc-case", nil
	case Router:
		return "router", nil
	case Phone:
		return "phone", nil
	case Smartphone:
		return "smartphone", nil
	case Stethoscope:
		return "stethoscope", nil
	case UtilityPole:
		return "utility-pole", nil
	case Megaphone:
		return "megaphone", nil
	case EthernetPort:
		return "ethernet-port", nil
	case Earth:
		return "earth", nil
	case Globe:
		return "globe", nil
	case Shield:
		return "shield", nil
	case Volleyball:
		return "volleyball", nil
	case Ruler:
		return "ruler", nil
	case Calculator:
		return "calculator", nil
	case Music:
		return "music", nil
	case Drum:
		return "drum", nil
	case Theater:
		return "theater", nil
	case ShoppingBag:
		return "shopping-bag", nil
	case ShoppingBasket:
		return "shopping-basket", nil
	case ShoppingCart:
		return "shopping-cart", nil
	case Barcode:
		return "barcode", nil
	case Shirt:
		return "shirt", nil
	case TentTree:
		return "tent-tree", nil
	case Utensils:
		return "utensils", nil
	case ShowerHead:
		return "shower-head", nil
	case WashingMachine:
		return "washing-machine", nil
	case BedSingle:
		return "bed-single", nil
	case BedDouble:
		return "bed-double", nil
	case BusFront:
		return "bus-front", nil
	case Pill:
		return "pill", nil
	case Syringe:
		return "syringe", nil
	case Microscope:
		return "microscope", nil
	case Siren:
		return "siren", nil
	case Zap:
		return "zap", nil
	case Heater:
		return "heater", nil
	case BatteryCharging:
		return "battery-charging", nil
	case User:
		return "user", nil
	case VenetianMask:
		return "venetian-mask", nil
	case House:
		return "house", nil
	case Hammer:
		return "hammer", nil
	case Microwave:
		return "microwave", nil
	case PaintRoller:
		return "paint-roller", nil
	case PaintbrushVertical:
		return "paintbrush-vertical", nil
	case TvMinimalPlay:
		return "tv-minimal-play", nil
	case Wine:
		return "wine", nil
	case Medal:
		return "medal", nil
	case Crown:
		return "crown", nil
	case Milk:
		return "milk", nil
	case GlassWater:
		return "glass-water", nil
	case Droplet:
		return "droplet", nil
	case HandPlatter:
		return "hand-platter", nil
	case FireExtinguisher:
		return "fire-extinguisher", nil
	case Package:
		return "package", nil
	case Armchair:
		return "armchair", nil
	case AtSign:
		return "at-sign", nil
	case Cake:
		return "cake", nil
	case Building:
		return "building", nil
	case Cog:
		return "cog", nil
	case IdCard:
		return "id-card", nil
	case Mail:
		return "mail", nil
	case Search:
		return "search", nil
	case Binoculars:
		return "binoculars", nil
	case TreePalm:
		return "tree-palm", nil
	case Trees:
		return "trees", nil
	case Flower:
		return "flower", nil
	case Dog:
		return "dog", nil
	case PawPrint:
		return "paw-print", nil
	case Cat:
		return "cat", nil
	case Fish:
		return "fish", nil
	case Bird:
		return "bird", nil
	case IceCreamCone:
		return "ice-cream-cone", nil
	case Beef:
		return "beef", nil
	case Pizza:
		return "pizza", nil
	case Apple:
		return "apple", nil
	case Bean:
		return "bean", nil
	case Drumstick:
		return "drumstick", nil
	case Salad:
		return "salad", nil
	case Sandwich:
		return "sandwich", nil
	case Bike:
		return "bike", nil
	case Coins:
		return "coins", nil
	case Gamepad:
		return "gamepad", nil
	case Skull:
		return "skull", nil
	case Sword:
		return "sword", nil
	case BellElectric:
		return "bell-electric", nil
	case Heart:
		return "heart", nil
	case Clover:
		return "clover", nil
	case MonitorPlay:
		return "monitor-play", nil
	case Glasses:
		return "glasses", nil
	case KeyRound:
		return "key-round", nil
	case Candy:
		return "candy", nil
	case Baby:
		return "baby", nil
	}
}
