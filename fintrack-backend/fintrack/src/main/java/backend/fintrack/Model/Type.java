package backend.fintrack.Model;

public enum Type {
    INCOME("Receita"),
    EXPENSE("Despesa");

    private final String value;

    Type(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Type fromValue(String value) {
        for (Type type : Type.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid type: " + value);
    }
}
